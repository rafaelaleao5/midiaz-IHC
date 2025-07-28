"use client"

import { useState } from "react"
import { ArrowLeft, Upload, ScanFace, GitCompare, Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar"
import { useFaceRecognition } from "@/lib/face-recognition-service"
import { useRouter } from "next/navigation"

export default function FaceTestPage() {
  const [activeTab, setActiveTab] = useState("compare")
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [targetImage, setTargetImage] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState("")

  const { detectFaceInImage, compareTwoFaces, checkApiHealth } = useFaceRecognition()
  const router = useRouter()

  const handleImageUpload = (setter: (file: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0])
    }
  }

  const handleCompareFaces = async () => {
    if (!referenceImage || !targetImage) {
      setError("Selecione ambas as imagens")
      return
    }

    setIsProcessing(true)
    setError("")
    setResults(null)

    try {
      const result = await compareTwoFaces(referenceImage, targetImage)
      setResults({
        type: "compare",
        data: result
      })
    } catch (error) {
      console.error('Erro na comparação:', error)
      setError("Erro ao comparar rostos. Verifique se as imagens contêm rostos claros.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDetectFace = async () => {
    if (!referenceImage || !targetImage) {
      setError("Selecione ambas as imagens")
      return
    }

    setIsProcessing(true)
    setError("")
    setResults(null)

    try {
      const result = await detectFaceInImage(referenceImage, targetImage)
      setResults({
        type: "detect",
        data: result
      })
    } catch (error) {
      console.error('Erro na detecção:', error)
      setError("Erro ao detectar rosto. Verifique se as imagens contêm rostos claros.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setReferenceImage(null)
    setTargetImage(null)
    setResults(null)
    setError("")
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navigation />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-bold text-gray-900 italic">Teste de Reconhecimento Facial</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* API Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">API de Reconhecimento Facial Ativa</span>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="compare" className="flex items-center space-x-2">
                  <GitCompare size={16} />
                  <span>Comparar Rostos</span>
                </TabsTrigger>
              <TabsTrigger value="detect" className="flex items-center space-x-2">
                <Search size={16} />
                <span>Detectar Rostos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compare" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic">Comparar Dois Rostos</CardTitle>
                  <p className="text-sm text-gray-600">
                    Verifique se duas imagens contêm a mesma pessoa
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Imagem de Referência</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {referenceImage ? (
                          <div>
                            <img
                              src={URL.createObjectURL(referenceImage)}
                              alt="Referência"
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReferenceImage(null)}
                            >
                              Trocar
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                            <p className="text-sm text-gray-600 mb-2">Clique para selecionar</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload(setReferenceImage)}
                              className="hidden"
                              id="referenceImage"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("referenceImage")?.click()}
                            >
                              Selecionar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Imagem para Comparar</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {targetImage ? (
                          <div>
                            <img
                              src={URL.createObjectURL(targetImage)}
                              alt="Alvo"
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTargetImage(null)}
                            >
                              Trocar
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                            <p className="text-sm text-gray-600 mb-2">Clique para selecionar</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload(setTargetImage)}
                              className="hidden"
                              id="targetImage"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("targetImage")?.click()}
                            >
                              Selecionar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={handleCompareFaces}
                      disabled={!referenceImage || !targetImage || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={16} />
                          Comparando...
                        </>
                      ) : (
                        <>
                          <GitCompare className="mr-2" size={16} />
                          Comparar Rostos
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Limpar
                    </Button>
                  </div>

                  {/* Results */}
                  {results && results.type === "compare" && (
                    <Card className="mt-4">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          {results.data.match ? (
                            <>
                              <CheckCircle className="text-green-600" size={24} />
                              <div>
                                <h4 className="font-medium text-green-900">Rostos Correspondem!</h4>
                                <p className="text-sm text-green-700">As duas imagens contêm a mesma pessoa</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="text-red-600" size={24} />
                              <div>
                                <h4 className="font-medium text-red-900">Rostos Diferentes</h4>
                                <p className="text-sm text-red-700">As duas imagens contêm pessoas diferentes</p>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="detect" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic">Detectar Rosto em Imagem</CardTitle>
                  <p className="text-sm text-gray-600">
                    Encontre ocorrências de um rosto específico em uma imagem
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Rosto de Referência</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {referenceImage ? (
                          <div>
                            <img
                              src={URL.createObjectURL(referenceImage)}
                              alt="Referência"
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReferenceImage(null)}
                            >
                              Trocar
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                            <p className="text-sm text-gray-600 mb-2">Clique para selecionar</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload(setReferenceImage)}
                              className="hidden"
                              id="referenceImageDetect"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("referenceImageDetect")?.click()}
                            >
                              Selecionar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Imagem para Buscar</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {targetImage ? (
                          <div>
                            <img
                              src={URL.createObjectURL(targetImage)}
                              alt="Alvo"
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTargetImage(null)}
                            >
                              Trocar
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                            <p className="text-sm text-gray-600 mb-2">Clique para selecionar</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload(setTargetImage)}
                              className="hidden"
                              id="targetImageDetect"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("targetImageDetect")?.click()}
                            >
                              Selecionar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={handleDetectFace}
                      disabled={!referenceImage || !targetImage || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={16} />
                          Detectando...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2" size={16} />
                          Detectar Rosto
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Limpar
                    </Button>
                  </div>

                  {/* Results */}
                  {results && results.type === "detect" && (
                    <Card className="mt-4">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <ScanFace className="text-blue-600" size={24} />
                            <div>
                              <h4 className="font-medium text-gray-900">Resultado da Detecção</h4>
                              <p className="text-sm text-gray-600">
                                {results.data.found_matches} ocorrência{results.data.found_matches !== 1 ? "s" : ""} encontrada{results.data.found_matches !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          
                          {results.data.matches.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700">Localizações encontradas:</p>
                              {results.data.matches.map((match: any, index: number) => (
                                <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                                  <p>Match {index + 1}:</p>
                                  <p>Top: {match.location.top}, Right: {match.location.right}</p>
                                  <p>Bottom: {match.location.bottom}, Left: {match.location.left}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="text-red-600" size={20} />
                  <p className="text-red-800">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Instruções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Para melhores resultados:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use fotos com rostos claros e bem iluminados</li>
                  <li>• Evite óculos escuros ou chapéus</li>
                  <li>• Certifique-se de que há apenas um rosto na imagem de referência</li>
                  <li>• Use imagens de boa qualidade (mínimo 200x200 pixels)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigationBar />
    </div>
  )
} 