"use client"

import { useState } from "react"
import { ArrowLeft, Filter, Search, Grid3X3, List, ScanFace, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar" // Importar a nova barra de navegação
import { useApp } from "@/contexts/AppContext"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

export default function EventGalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { events, photos } = useApp()
  const router = useRouter()
  const params = useParams()

  const eventId = params.eventId as string
  const event = events.find((e) => e.id === eventId)
  const eventPhotos = photos.filter((p) => p.eventId === eventId)

  const filters = [
    { id: "all", label: "Todas", icon: Grid3X3, count: eventPhotos.length },
    { id: "face", label: "Por Rosto", icon: ScanFace, count: eventPhotos.filter((p) => p.hasUser).length },
    { id: "number", label: "Por Número", icon: Hash, count: eventPhotos.filter((p) => p.number).length },
  ]

  const filteredPhotos = eventPhotos.filter((photo) => {
    if (activeFilter === "face") return photo.hasUser
    if (activeFilter === "number") return photo.number
    return true
  })

  // Separate highlights and regular photos
  const highlightPhotos = filteredPhotos.sort((a, b) => b.likes - a.likes).slice(0, 6)
  const regularPhotos = filteredPhotos.filter((photo) => !highlightPhotos.includes(photo))

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

  const handlePhotoClick = (photo: any) => {
    router.push(`/photo/${photo.id}`)
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navigation />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 pt-16">
        {" "}
        {/* Added pt-16 for header spacing */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="font-bold text-gray-900 italic">{event.name}</h1>
            <Button variant="ghost" size="sm" className="p-2" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={20} />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Buscar por número, cor da roupa..."
              className="pl-9 py-2 text-sm border-gray-200 focus:border-purple-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={14} />
                  <span>{filter.label}</span>
                  <Badge variant="secondary" className="text-xs bg-white/20 text-current">
                    {filter.count}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>
        {/* Advanced Filters */}
        {showFilters && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Até R$ 10
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    R$ 10-20
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Acima R$ 20
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orientação</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Retrato
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Paisagem
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Quadrada
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Gallery */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{filteredPhotos.length} fotos encontradas</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "text-purple-600" : "text-gray-400"}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "text-purple-600" : "text-gray-400"}
              >
                <List size={16} />
              </Button>
            </div>
          </div>

          {/* Highlights Section */}
          {highlightPhotos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 italic">Fotos em Destaque</h3>
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

                        {/* Overlays */}
                        <div className="absolute top-2 left-2 flex flex-col space-y-1">
                          {photo.hasUser && (
                            <Badge className="text-xs bg-green-500 hover:bg-green-600">
                              <ScanFace size={10} className="mr-1" />
                              Você
                            </Badge>
                          )}
                          {photo.number && (
                            <Badge className="text-xs bg-blue-500 hover:bg-blue-600">#{photo.number}</Badge>
                          )}
                        </div>

                        <div className="absolute bottom-2 right-2">
                          <Badge variant="secondary" className="text-xs bg-black/70 text-white hover:bg-black/70">
                            R$ {photo.price.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Photos Section */}
          {regularPhotos.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 italic">Todas as Fotos</h3>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-3">
                  {regularPhotos.map((photo) => (
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

                          {/* Overlays */}
                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            {photo.hasUser && (
                              <Badge className="text-xs bg-green-500 hover:bg-green-600">
                                <ScanFace size={10} className="mr-1" />
                                Você
                              </Badge>
                            )}
                            {photo.number && (
                              <Badge className="text-xs bg-blue-500 hover:bg-blue-600">#{photo.number}</Badge>
                            )}
                          </div>

                          <div className="absolute bottom-2 right-2">
                            <Badge variant="secondary" className="text-xs bg-black/70 text-white hover:bg-black/70">
                              R$ {photo.price.toFixed(2)}
                            </Badge>
                          </div>

                          {/* Quick Action */}
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Ver Foto
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-3">
                  {regularPhotos.map((photo) => (
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
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover"
                            />
                            {photo.hasUser && (
                              <Badge className="absolute -top-1 -left-1 text-xs bg-green-500 hover:bg-green-600">
                                <ScanFace size={8} />
                              </Badge>
                            )}
                          </div>
                          <div className="flex-1 p-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Foto #{photo.id.split("-")[1]}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                {photo.number && (
                                  <Badge variant="outline" className="text-xs">
                                    #{photo.number}
                                  </Badge>
                                )}
                                {photo.hasUser && (
                                  <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                                    Você aparece
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-600 mb-1">R$ {photo.price.toFixed(2)}</p>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
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
          )}

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent">
              Carregar Mais Fotos
            </Button>
          </div>
        </div>
      </section>

      <BottomNavigationBar />
    </div>
  )
}
