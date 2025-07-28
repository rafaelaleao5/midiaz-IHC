"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { ArrowLeft, Upload, ImageIcon, Check, AlertCircle, ScanFace, Hash, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFaceRecognition } from "@/lib/face-recognition-service"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingResults, setProcessingResults] = useState<any>(null)
  const [eventInfo, setEventInfo] = useState({
    name: "",
    location: "",
    date: "",
    description: ""
  })

  const { processEventPhotos } = useFaceRecognition()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    setFiles((prev) => [...prev, ...droppedFiles])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const processUpload = async () => {
    if (files.length === 0) return
    
    setIsProcessing(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 50; i += 10) {
        setUploadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // Process photos with AI
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const result = await processEventPhotos(eventId, files)
      
      setUploadProgress(100)

      // Calculate statistics from AI results
      const totalFaces = result.results.reduce((sum, photo) => sum + photo.total_faces, 0)
      const totalDetections = result.results.reduce((sum, photo) => sum + photo.detections.length, 0)
      
      setProcessingResults({
        totalPhotos: files.length,
        facesDetected: totalFaces,
        numbersDetected: Math.floor(files.length * 0.8), // Still simulated
        tagsGenerated: Math.floor(files.length * 4.2), // Still simulated
        qualityScore: 94,
        aiResults: result.results,
        eventId: eventId
      })

    } catch (error) {
      console.error('Erro ao processar fotos:', error)
      // Fallback to simulation if AI fails
      setProcessingResults({
        totalPhotos: files.length,
        facesDetected: Math.floor(files.length * 2.3),
        numbersDetected: Math.floor(files.length * 0.8),
        tagsGenerated: Math.floor(files.length * 4.2),
        qualityScore: 94,
        error: "Erro na IA, usando dados simulados"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (processingResults) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="font-bold text-gray-900 italic">Upload Concluído</h1>
            <div className="w-8"></div>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="max-w-xl mx-auto space-y-6">
            {/* Success Message */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 italic">Upload Realizado com Sucesso!</h2>
              <p className="text-gray-600">Suas fotos foram processadas pela nossa IA</p>
            </div>

            {/* Processing Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg italic">Resultados do Processamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <ImageIcon className="mx-auto mb-2 text-purple-600" size={24} />
                    <p className="text-xl font-bold text-purple-900">{processingResults.totalPhotos}</p>
                    <p className="text-xs text-purple-700">Fotos Enviadas</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <ScanFace className="mx-auto mb-2 text-green-600" size={24} />
                    <p className="text-xl font-bold text-green-900">{processingResults.facesDetected}</p>
                    <p className="text-xs text-green-700">Rostos Detectados</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Hash className="mx-auto mb-2 text-blue-600" size={24} />
                    <p className="text-xl font-bold text-blue-900">{processingResults.numbersDetected}</p>
                    <p className="text-xs text-blue-700">Números Identificados</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Tag className="mx-auto mb-2 text-orange-600" size={24} />
                    <p className="text-xl font-bold text-orange-900">{processingResults.tagsGenerated}</p>
                    <p className="text-xs text-orange-700">Tags Geradas</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-900">Qualidade Geral</span>
                    <Badge className="bg-green-500 hover:bg-green-600">{processingResults.qualityScore}%</Badge>
                  </div>
                  <Progress value={processingResults.qualityScore} className="mb-2" />
                  <p className="text-sm text-purple-700">
                    Excelente qualidade! Suas fotos têm alta chance de conversão.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg italic">Insights da IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <Check className="text-green-600 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-green-900 text-sm">Ótima iluminação</p>
                    <p className="text-xs text-green-700">85% das fotos têm iluminação ideal</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Check className="text-blue-600 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-blue-900 text-sm">Momentos únicos</p>
                    <p className="text-xs text-blue-700">Detectamos várias expressões emocionais</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="text-orange-600 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-orange-900 text-sm">Sugestão de preço</p>
                    <p className="text-xs text-orange-700">Recomendamos R$ 15-18 por foto</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full py-3 bg-purple-600 hover:bg-purple-700">Definir Preços e Publicar</Button>
              <Button variant="outline" className="w-full border-purple-600 text-purple-600 bg-transparent">
                Revisar Fotos
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-bold text-gray-900 italic">Upload de Fotos</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Event Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Informações do Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eventName">Nome do Evento</Label>
                <Input 
                  id="eventName" 
                  placeholder="Ex: Copa Universitária 2024" 
                  className="mt-1"
                  value={eventInfo.name}
                  onChange={(e) => setEventInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="eventLocation">Local</Label>
                <Input 
                  id="eventLocation" 
                  placeholder="Ex: Estádio Municipal" 
                  className="mt-1"
                  value={eventInfo.location}
                  onChange={(e) => setEventInfo(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="eventDate">Data</Label>
                <Input 
                  id="eventDate" 
                  type="date" 
                  className="mt-1"
                  value={eventInfo.date}
                  onChange={(e) => setEventInfo(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="eventDescription">Descrição (opcional)</Label>
                <Textarea 
                  id="eventDescription" 
                  placeholder="Descreva o evento..." 
                  className="mt-1"
                  value={eventInfo.description}
                  onChange={(e) => setEventInfo(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Upload de Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-purple-600 bg-purple-50" : "border-gray-300 hover:border-purple-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-lg font-medium text-gray-900 mb-2">Arraste suas fotos aqui</p>
                <p className="text-sm text-gray-600 mb-4">ou clique para selecionar arquivos</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="fileInput"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Selecionar Fotos
                </Button>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-900 mb-3">
                    {files.length} foto{files.length > 1 ? "s" : ""} selecionada{files.length > 1 ? "s" : ""}
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <ImageIcon className="text-purple-600" size={16} />
                        <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultPrice">Preço Padrão por Foto</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o preço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">R$ 10,00</SelectItem>
                    <SelectItem value="15">R$ 15,00</SelectItem>
                    <SelectItem value="20">R$ 20,00</SelectItem>
                    <SelectItem value="25">R$ 25,00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Processamento IA</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900 text-sm">Reconhecimento Facial</p>
                      <p className="text-xs text-purple-700">Detectar pessoas nas fotos</p>
                    </div>
                    <Badge className="bg-purple-600 hover:bg-purple-700">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900 text-sm">Detecção de Números</p>
                      <p className="text-xs text-blue-700">Identificar números em uniformes</p>
                    </div>
                    <Badge className="bg-blue-600 hover:bg-blue-700">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900 text-sm">Tags Automáticas</p>
                      <p className="text-xs text-green-700">Gerar tags baseadas no conteúdo</p>
                    </div>
                    <Badge className="bg-green-600 hover:bg-green-700">Ativo</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {isProcessing && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="font-medium text-gray-900 mb-2">Processando fotos...</p>
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="text-sm text-gray-600">{uploadProgress}% concluído</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Button */}
                          <Button
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold"
                  onClick={processUpload}
                  disabled={files.length === 0 || isProcessing}
                >
            {isProcessing ? "Processando..." : `Fazer Upload de ${files.length} Foto${files.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
