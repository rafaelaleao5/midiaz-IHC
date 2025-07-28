"use client"

import { useState } from "react"
import { Heart, Download, ShoppingCart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar" // Importar a nova barra de navegação
import { useApp } from "@/contexts/AppContext"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

export default function PhotoPage() {
  const [isLiked, setIsLiked] = useState(false)
  const { photos, events, addToCart } = useApp()
  const router = useRouter()
  const params = useParams()

  const photoId = params.id as string
  const photo = photos.find((p) => p.id === photoId)
  const event = photo ? events.find((e) => e.id === photo.eventId) : null

  if (!photo || !event) {
    return (
      <div className="min-h-screen bg-white pb-16 md:pb-0">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Foto não encontrada</p>
        </div>
        <BottomNavigationBar />
      </div>
    )
  }

  const recommendations = photos.filter((p) => p.eventId === photo.eventId && p.id !== photo.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart({
      photoId: photo.id,
      eventId: photo.eventId,
      eventName: event.name,
      price: photo.price,
      image: photo.image,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navigation />

      {/* Photo Display */}
      <section className="px-4 py-4 pt-20">
        {" "}
        {/* Added pt-20 for header spacing */}
        <div className="max-w-xl mx-auto">
          <div className="relative mb-6">
            <Image
              src={photo.image || "/placeholder.svg"}
              alt={`Foto ${photo.id}`}
              width={400}
              height={600}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />

            {/* AI Detection Overlay */}
            {photo.hasUser && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 hover:bg-green-600 flex items-center space-x-1">
                  <Zap size={12} />
                  <span className="text-xs">Você detectado - {photo.confidence || 95}%</span>
                </Badge>
              </div>
            )}

            {/* Photo Stats */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/70">
                  <Heart size={10} className="mr-1" />
                  {photo.likes}
                </Badge>
                <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/70">
                  👁 {photo.views}
                </Badge>
              </div>
              <Badge className="bg-purple-600 hover:bg-purple-700 font-bold">R$ {photo.price.toFixed(2)}</Badge>
            </div>
          </div>

          {/* Photo Info */}
          <div className="space-y-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2 italic">Foto #{photo.id.split("-")[1]}</h1>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📸 {event.photographer}</p>
                <p>🏆 {event.name}</p>
                <p>📅 {event.date}</p>
              </div>
            </div>

            {/* Tags */}
            {photo.tags && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="text-purple-600" size={16} />
                  <span className="font-medium text-purple-900">Insights da IA</span>
                </div>
                <div className="space-y-2 text-sm text-purple-800">
                  {photo.hasUser && <p>• Você aparece em destaque nesta foto</p>}
                  <p>• Momento de alta emoção capturado</p>
                  <p>• Qualidade de imagem: Excelente</p>
                  <p>• Esta foto tem potencial viral!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <Button
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold text-lg"
              onClick={handleBuyNow}
            >
              <ShoppingCart className="mr-2" size={20} />
              Comprar por R$ {photo.price.toFixed(2)}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
                onClick={handleAddToCart}
              >
                <Download className="mr-2" size={16} />
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} size={16} />
                {isLiked ? "Favoritado" : "Favoritar"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="px-4 py-6 bg-gray-50">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 italic">Fotos Similares</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600"
                onClick={() => router.push(`/gallery/${event.id}`)}
              >
                Ver todas
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((recPhoto) => (
                <Card
                  key={recPhoto.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/photo/${recPhoto.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={recPhoto.image || "/placeholder.svg"}
                        alt={`Foto ${recPhoto.id}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover"
                      />
                      {recPhoto.hasUser && (
                        <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-xs">Você</Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="absolute bottom-2 right-2 text-xs bg-black/70 text-white hover:bg-black/70"
                      >
                        R$ {recPhoto.price.toFixed(2)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="text-purple-600" size={16} />
                <span className="font-medium text-purple-900">Recomendação Inteligente</span>
              </div>
              <p className="text-sm text-purple-800">
                Baseado no seu histórico, você também pode gostar das fotos do mesmo evento com ângulos similares.
              </p>
            </div>
          </div>
        </section>
      )}
      <BottomNavigationBar />
    </div>
  )
}
