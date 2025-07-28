"use client"

import { useState } from "react"
import { ArrowLeft, Heart, Share2, Download, ShoppingCart, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function PhotoPage() {
  const [isLiked, setIsLiked] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(true)

  const photoData = {
    id: 1,
    image: "/placeholder.svg?height=600&width=400",
    price: "R$ 15,00",
    likes: 45,
    views: 234,
    photographer: "João Silva Photography",
    event: "Copa Universitária 2024",
    date: "15 Dez 2024",
    tags: ["Esporte", "Futebol", "Gol", "Comemoração"],
    hasUser: true,
    confidence: 98,
  }

  const recommendations = [
    { id: 2, image: "/placeholder.svg?height=200&width=200", price: "R$ 15,00", similarity: 95 },
    { id: 3, image: "/placeholder.svg?height=200&width=200", price: "R$ 15,00", similarity: 92 },
    { id: 4, image: "/placeholder.svg?height=200&width=200", price: "R$ 15,00", similarity: 89 },
    { id: 5, image: "/placeholder.svg?height=200&width=200", price: "R$ 15,00", similarity: 87 },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => setIsLiked(!isLiked)}>
              <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : ""} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Photo Display */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-6">
            <Image
              src={photoData.image || "/placeholder.svg"}
              alt={`Foto ${photoData.id}`}
              width={400}
              height={600}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />

            {/* AI Detection Overlay */}
            {photoData.hasUser && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 hover:bg-green-600 flex items-center space-x-1">
                  <Zap size={12} />
                  <span className="text-xs">Você detectado - {photoData.confidence}%</span>
                </Badge>
              </div>
            )}

            {/* Photo Stats */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/70">
                  <Heart size={10} className="mr-1" />
                  {photoData.likes}
                </Badge>
                <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/70">
                  👁 {photoData.views}
                </Badge>
              </div>
              <Badge className="bg-purple-600 hover:bg-purple-700 font-bold">{photoData.price}</Badge>
            </div>
          </div>

          {/* Photo Info */}
          <div className="space-y-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2 italic">Foto #{photoData.id}</h1>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📸 {photoData.photographer}</p>
                <p>🏆 {photoData.event}</p>
                <p>📅 {photoData.date}</p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {photoData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="text-purple-600" size={16} />
                  <span className="font-medium text-purple-900">Insights da IA</span>
                </div>
                <div className="space-y-2 text-sm text-purple-800">
                  <p>• Você aparece em destaque nesta foto</p>
                  <p>• Momento de alta emoção capturado</p>
                  <p>• Qualidade de imagem: Excelente</p>
                  <p>• Esta foto tem potencial viral!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <Button className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold text-lg">
              <ShoppingCart className="mr-2" size={20} />
              Comprar por {photoData.price}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent">
                <Download className="mr-2" size={16} />
                Preview
              </Button>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent">
                <Star className="mr-2" size={16} />
                Favoritar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      {showRecommendations && (
        <section className="px-4 py-6 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 italic">Fotos Similares</h3>
              <Button variant="ghost" size="sm" className="text-purple-600">
                Ver todas
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((photo) => (
                <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={photo.image || "/placeholder.svg"}
                        alt={`Foto ${photo.id}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-xs">
                        {photo.similarity}% similar
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="absolute bottom-2 right-2 text-xs bg-black/70 text-white hover:bg-black/70"
                      >
                        {photo.price}
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
    </div>
  )
}
