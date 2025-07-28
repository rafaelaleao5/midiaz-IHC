"use client"

import { useState } from "react"
import { ScanFace, Sparkles, ShoppingCart, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar"
import { useApp } from "@/contexts/AppContext"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function FoundPhotosPage() {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const { foundPhotos, addToCart, selectedEvent, user } = useApp()
  const router = useRouter()

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) => (prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]))
  }

  const handleAddToCart = () => {
    selectedPhotos.forEach((photoId) => {
      const photo = foundPhotos.find((p) => p.id === photoId)
      if (photo && selectedEvent) {
        addToCart({
          photoId: photo.id,
          eventId: photo.eventId,
          eventName: selectedEvent.name,
          price: photo.price,
          image: photo.image,
        })
      }
    })
    router.push("/cart")
  }

  const handlePhotoClick = (photo: any) => {
    router.push(`/photo/${photo.id}`)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500"
    if (confidence >= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 90) return "Alta confiança"
    if (confidence >= 80) return "Média confiança"
    return "Baixa confiança"
  }

  if (foundPhotos.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-16 md:pb-0">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ScanFace className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">Nenhuma foto encontrada com você</p>
            <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/search")}>
              Buscar em Outros Eventos
            </Button>
          </div>
        </div>
        <BottomNavigationBar />
      </div>
    )
  }

  const totalPrice = selectedPhotos.reduce((sum, photoId) => {
    const photo = foundPhotos.find((p) => p.id === photoId)
    return sum + (photo?.price || 0)
  }, 0)

  const averageConfidence = foundPhotos.reduce((sum, photo) => sum + (photo.confidence || 0), 0) / foundPhotos.length

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navigation />

      {/* Success Banner */}
      <section className="px-4 py-6 bg-gradient-to-r from-green-50 to-purple-50 pt-20">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ScanFace size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 italic">
              Encontramos <span className="text-purple-600">{foundPhotos.length} fotos</span> com você!
            </h2>
            <p className="text-gray-600">Nossa IA identificou você automaticamente nessas imagens</p>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Sparkles size={16} className="mr-1 text-purple-600" />
              <span>Reconhecimento automático</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div>
              <span>{selectedEvent?.name || "Evento"}</span>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-medium text-gray-900">Confiança Média</span>
              </div>
              <Badge className={`${getConfidenceColor(averageConfidence)} hover:${getConfidenceColor(averageConfidence)}`}>
                {averageConfidence.toFixed(0)}%
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1">{getConfidenceText(averageConfidence)}</p>
          </div>
        </div>
      </section>

      {/* Featured Carousel */}
      <section className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4 italic">Suas Melhores Fotos</h3>
          <div className="flex space-x-3 overflow-x-auto pb-4">
            {foundPhotos.slice(0, 3).map((photo) => (
              <div key={photo.id} className="flex-shrink-0 relative">
                <Image
                  src={photo.image || "/placeholder.svg"}
                  alt={`Foto ${photo.id}`}
                  width={200}
                  height={250}
                  className="w-40 h-48 object-cover rounded-xl cursor-pointer"
                  onClick={() => handlePhotoClick(photo)}
                />
                <div className="absolute top-2 right-2">
                  <Badge className={`${getConfidenceColor(photo.confidence || 0)} text-white text-xs`}>
                    {photo.confidence?.toFixed(0)}%
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <Button
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-xs"
                    onClick={() => togglePhotoSelection(photo.id)}
                  >
                    {selectedPhotos.includes(photo.id) ? "Remover" : "Adicionar"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Photos Grid */}
      <section className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 italic">Todas as Fotos</h3>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
              onClick={() => {
                if (selectedPhotos.length === foundPhotos.length) {
                  setSelectedPhotos([])
                } else {
                  setSelectedPhotos(foundPhotos.map((p) => p.id))
                }
              }}
            >
              {selectedPhotos.length === foundPhotos.length ? "Desmarcar Todas" : "Selecionar Todas"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {foundPhotos.map((photo) => (
              <Card
                key={photo.id}
                className={`overflow-hidden transition-all cursor-pointer ${
                  selectedPhotos.includes(photo.id) ? "ring-2 ring-purple-600 shadow-lg" : "hover:shadow-lg"
                }`}
                onClick={() => togglePhotoSelection(photo.id)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={photo.image || "/placeholder.svg"}
                      alt={`Foto ${photo.id}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover"
                    />

                    {/* Confidence Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getConfidenceColor(photo.confidence || 0)} text-white text-xs`}>
                        {photo.confidence?.toFixed(0)}%
                      </Badge>
                    </div>

                    {/* Selection Indicator */}
                    {selectedPhotos.includes(photo.id) && (
                      <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <Badge
                      variant="secondary"
                      className="absolute bottom-2 right-2 text-xs bg-black/70 text-white hover:bg-black/70"
                    >
                      R$ {photo.price.toFixed(2)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Information */}
      <section className="px-4 py-6 bg-gray-50">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Info size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Como funciona o reconhecimento?</h4>
                  <p className="text-xs text-gray-600">
                    Nossa IA analisa cada foto e identifica rostos similares ao seu. 
                    A porcentagem indica a confiança da identificação. 
                    Fotos com confiança acima de 80% são mais precisas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fixed Bottom Bar */}
      {selectedPhotos.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:hidden">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">
                  {selectedPhotos.length} foto{selectedPhotos.length > 1 ? "s" : ""} selecionada
                  {selectedPhotos.length > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-gray-600">Total: R$ {totalPrice.toFixed(2)}</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddToCart}>
                <ShoppingCart size={16} className="mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Spacing for Fixed Bar */}
      <div className="h-20"></div>
      <BottomNavigationBar />
    </div>
  )
}
