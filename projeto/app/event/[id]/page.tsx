"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Camera, Users, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar" // Importar a nova barra de navegação
import { useApp } from "@/contexts/AppContext"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

export default function EventPage() {
  const [activeTab, setActiveTab] = useState("highlights")
  const { events, photos, setSelectedEvent, setFoundPhotos } = useApp()
  const router = useRouter()
  const params = useParams()

  const eventId = params.id as string
  const event = events.find((e) => e.id === eventId)
  const eventPhotos = photos.filter((p) => p.eventId === eventId)

  useEffect(() => {
    if (event) {
      setSelectedEvent(event)
    }
  }, [event, setSelectedEvent])

  if (!event) {
    return (
      <div className="min-h-screen bg-white pb-16 md:pb-0">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Evento não encontrado</p>
        </div>
        <BottomNavigationBar />
      </div>
    )
  }

  const highlightPhotos = eventPhotos.sort((a, b) => b.likes - a.likes).slice(0, 8)

  const topSelling = eventPhotos.sort((a, b) => b.views - a.views).slice(0, 6)

  const handleFindMyPhotos = () => {
    const myPhotos = eventPhotos.filter((photo) => photo.hasUser)
    setFoundPhotos(myPhotos)
    router.push("/found-photos")
  }

  const handleViewAllPhotos = () => {
    router.push(`/gallery/${event.id}`)
  }

  const handlePhotoClick = (photo: any) => {
    router.push(`/photo/${photo.id}`)
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navigation />

      {/* Event Hero */}
      <section className="px-4 py-6 pt-20">
        {" "}
        {/* Added pt-20 for header spacing */}
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-6">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-xl"
            />
            <Badge className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700">
              {event.totalPhotos} fotos
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 italic">{event.name}</h1>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Camera size={16} className="mr-2" />
                  <span className="text-sm">{event.photographer}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{event.totalPhotos}</p>
                <p className="text-xs text-gray-500">Fotos</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{event.views.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Visualizações</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{event.sales}</p>
                <p className="text-xs text-gray-500">Vendas</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold"
                onClick={handleFindMyPhotos}
              >
                <Users className="mr-2" size={20} />
                Encontrar Minhas Fotos
              </Button>
              <Button
                variant="outline"
                className="w-full py-3 border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
                onClick={handleViewAllPhotos}
              >
                Ver Todas as Fotos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
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
              Mais Visualizadas
            </button>
          </div>

          {/* Highlights Tab */}
          {activeTab === "highlights" && (
            <div className="grid grid-cols-2 gap-3">
              {highlightPhotos.map((photo) => (
                <Card
                  key={photo.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePhotoClick(photo)}
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
                      <div className="absolute bottom-2 left-2 flex space-x-2">
                        <Badge variant="secondary" className="text-xs bg-black/70 text-white hover:bg-black/70">
                          <Heart size={10} className="mr-1" />
                          {photo.likes}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-black/70 text-white hover:bg-black/70">
                          👁 {photo.views}
                        </Badge>
                      </div>
                      {photo.hasUser && (
                        <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-xs">Você</Badge>
                      )}
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
                <Card
                  key={photo.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePhotoClick(photo)}
                >
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
                          <p className="font-medium text-gray-900">Foto #{photo.id.split("-")[1]}</p>
                          <p className="text-sm text-gray-600">{photo.views} visualizações</p>
                          {photo.hasUser && (
                            <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                              Você aparece aqui
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">R$ {photo.price.toFixed(2)}</p>
                          <Button size="sm" className="mt-1 bg-purple-600 hover:bg-purple-700">
                            Ver
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
      <BottomNavigationBar />
    </div>
  )
}
