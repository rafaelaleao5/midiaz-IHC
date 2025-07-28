"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, MapPin, Camera, Users, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function EventPage() {
  const [activeTab, setActiveTab] = useState("highlights")

  const eventData = {
    name: "Copa Universitária 2024",
    location: "Estádio Municipal - São Paulo",
    date: "15 de Dezembro, 2024",
    photographer: "João Silva Photography",
    totalPhotos: 1250,
    views: 15420,
    sales: 89,
  }

  const highlightPhotos = [
    { id: 1, image: "/placeholder.svg?height=300&width=300", likes: 45, views: 234 },
    { id: 2, image: "/placeholder.svg?height=300&width=300", likes: 38, views: 189 },
    { id: 3, image: "/placeholder.svg?height=300&width=300", likes: 52, views: 298 },
    { id: 4, image: "/placeholder.svg?height=300&width=300", likes: 29, views: 156 },
  ]

  const topSelling = [
    { id: 1, image: "/placeholder.svg?height=300&width=300", sales: 12, price: "R$ 15,00" },
    { id: 2, image: "/placeholder.svg?height=300&width=300", sales: 8, price: "R$ 15,00" },
    { id: 3, image: "/placeholder.svg?height=300&width=300", sales: 6, price: "R$ 15,00" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Heart size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Event Hero */}
      <section className="px-4 py-6">
        <div className="max-w-[1800px] mx-auto">
          <div className="relative mb-6">
            <Image
              src="/placeholder.svg?height=200&width=400"
              alt={eventData.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-xl"
            />
            <Badge className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700">
              {eventData.totalPhotos} fotos
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 italic">{eventData.name}</h1>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">{eventData.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">{eventData.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Camera size={16} className="mr-2" />
                  <span className="text-sm">{eventData.photographer}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{eventData.totalPhotos}</p>
                <p className="text-xs text-gray-500">Fotos</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{eventData.views.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Visualizações</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{eventData.sales}</p>
                <p className="text-xs text-gray-500">Vendas</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold">
                <Users className="mr-2" size={20} />
                Encontrar Minhas Fotos
              </Button>
              <Button
                variant="outline"
                className="w-full py-3 border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                Ver Todas as Fotos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab("highlights")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "highlights" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Destaques
            </button>
            <button
              onClick={() => setActiveTab("bestsellers")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "bestsellers" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mais Vendidas
            </button>
          </div>

          {/* Highlights Tab */}
          {activeTab === "highlights" && (
            <div className="grid grid-cols-2 gap-3">
              {highlightPhotos.map((photo) => (
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
                      <div className="absolute bottom-2 left-2 flex space-x-2">
                        <Badge variant="secondary" className="text-xs bg-black/70 text-white hover:bg-black/70">
                          <Heart size={10} className="mr-1" />
                          {photo.likes}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-black/70 text-white hover:bg-black/70">
                          👁 {photo.views}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Best Sellers Tab */}
          {activeTab === "bestsellers" && (
            <div className="space-y-4">
              {topSelling.map((photo, index) => (
                <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="relative flex-shrink-0">
                        <Image
                          src={photo.image || "/placeholder.svg"}
                          alt={`Foto ${photo.id}`}
                          width={100}
                          height={100}
                          className="w-20 h-20 object-cover"
                        />
                        <Badge className="absolute -top-1 -left-1 bg-purple-600 hover:bg-purple-700 text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="flex-1 p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Foto #{photo.id}</p>
                          <p className="text-sm text-gray-600">{photo.sales} vendas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{photo.price}</p>
                          <Button size="sm" className="mt-1 bg-purple-600 hover:bg-purple-700">
                            Comprar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-8"></div>
    </div>
  )
}
