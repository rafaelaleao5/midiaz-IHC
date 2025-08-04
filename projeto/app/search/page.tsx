"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ScanFace, ArrowUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar"
import { useApp } from "@/contexts/AppContext"
import { useFaceRecognition } from "@/lib/face-recognition-service"
import Image from "next/image"
import { useRouter } from "next/navigation"


export default function SearchPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300) // mostra botão após rolar 300px
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }


  const [activeFilter, setActiveFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [apiStatus, setApiStatus] = useState<"checking" | "available" | "unavailable">("checking")

  const { events, photos, searchQuery, setSelectedEvent, setFoundPhotos, user, showToast } = useApp()
  const { findUserPhotos, checkApiHealth } = useFaceRecognition()
  const router = useRouter()

  const [filteredEvents, setFilteredEvents] = useState(events)

  useEffect(() => {
    // Verificar status da API ao carregar a página
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const isAvailable = await checkApiHealth()
      setApiStatus(isAvailable ? "available" : "unavailable")
    } catch (error) {
      setApiStatus("unavailable")
    }
  }

  useEffect(() => {
    if (searchQuery || localSearchQuery) {
      const query = (searchQuery || localSearchQuery).toLowerCase()
      const filtered = events.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.photographer.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query),
      )
      setFilteredEvents(filtered)
    } else {
      setFilteredEvents(events)
    }
  }, [searchQuery, localSearchQuery, events])

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    router.push(`/event/${event.id}`)
  }

  const handleFindMyPhotos = async (eventId: string) => {
    if (!user) {
      showToast("Faça login para usar o reconhecimento facial", "error")
      router.push("/login")
      return
    }

    setIsSearching(true)

    try {
      // Buscar fotos do usuário usando a API de reconhecimento facial
      const result = await findUserPhotos(user.id, eventId)

      if (result.success && result.photos_found > 0) {
        // Converter resultados da API para o formato esperado pelo frontend
        const foundPhotos = result.photos.map((photo, index) => ({
          id: photo.photo_id,
          eventId: photo.event_id,
          image: photos.find(p => p.eventId === photo.event_id)?.image || "/placeholder.svg",
          price: 15 + Math.floor(Math.random() * 10),
          likes: Math.floor(Math.random() * 100) + 5,
          views: Math.floor(Math.random() * 500) + 50,
          hasUser: true,
          confidence: photo.confidence,
          number: Math.random() > 0.8 ? Math.floor(Math.random() * 99) + 1 : undefined,
          tags: ["Esporte", "Ação", "Momento", "Emoção"].slice(0, Math.floor(Math.random() * 4) + 1),
        }))

        setFoundPhotos(foundPhotos)
        showToast(`Encontramos ${result.photos_found} fotos com você!`, "success")
        router.push("/found-photos")
      } else {
        // Se não encontrou fotos reais, usar simulação
        const eventPhotos = photos.filter((photo) => photo.eventId === eventId && photo.hasUser)
        setFoundPhotos(eventPhotos)

        if (eventPhotos.length > 0) {
          showToast(`Encontramos ${eventPhotos.length} fotos com você!`, "success")
        } else {
          showToast("Nenhuma foto encontrada com você neste evento", "info")
        }
        router.push("/found-photos")
      }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error)
      showToast("Erro ao buscar fotos. Tente novamente.", "error")

      // Fallback para simulação
      const eventPhotos = photos.filter((photo) => photo.eventId === eventId && photo.hasUser)
      setFoundPhotos(eventPhotos)
      router.push("/found-photos")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query)
  }

  const handleFilterByCategory = (category: string) => {
    setLocalSearchQuery(category)
    setShowFilters(false)
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0 pt-16">
      <Navigation />

      {/* Search Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-4 bg-white border-b border-gray-200 pt-20">
        {" "}
        {/* Adjusted padding */}
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Buscar eventos, locais, fotógrafos..."
              className="pl-9 py-3 text-base border-gray-200 focus:border-purple-600"
              value={localSearchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 italic">
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""} encontrado
              {filteredEvents.length !== 1 ? "s" : ""}
            </h1>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} />
            </Button>
          </div>

          {/* API Status Indicator */}
          <div className="mt-2 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus === "available" ? "bg-green-500" :
                apiStatus === "unavailable" ? "bg-red-500" : "bg-yellow-500"
              }`}></div>
            <span className="text-xs text-gray-600">
              {apiStatus === "available" ? "IA disponível" :
                apiStatus === "unavailable" ? "IA indisponível" : "Verificando IA..."}
            </span>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={() => handleFilterByCategory("Esportivo")}
                    >
                      Esportivo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={() => handleFilterByCategory("Acadêmico")}
                    >
                      Acadêmico
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={() => handleFilterByCategory("Social")}
                    >
                      Social
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={() => handleFilterByCategory("Cultural")}
                    >
                      Cultural
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={() => handleFilterByCategory("Corporativo")}
                    >
                      Corporativo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={() => handleFilterByCategory("")}
                    >
                      Todos
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Hoje
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Esta semana
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Este mês
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Events List */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        {" "}
        {/* Adjusted padding */}
        <div className="max-w-4xl mx-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-600 mb-4">Tente buscar com outros termos ou verifique a ortografia</p>
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 bg-transparent"
                onClick={() => {
                  setLocalSearchQuery("")
                  setFilteredEvents(events)
                }}
              >
                Ver Todos os Eventos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => handleEventClick(event)}
                      />
                      <Badge className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700 text-xs">
                        {event.totalPhotos}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-bold text-gray-900 mb-2 cursor-pointer hover:text-purple-600"
                        onClick={() => handleEventClick(event)}
                      >
                        {event.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                      <p className="text-xs text-gray-500 mb-3">{event.photographer}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{event.date}</span>
                      </div>

                      <div className="space-y-2">
                        <Button
                          size="sm"
                          className="w-full bg-purple-600 hover:bg-purple-700 text-xs"
                          onClick={() => handleFindMyPhotos(event.id)}
                          disabled={isSearching}
                        >
                          {isSearching ? (
                            <>
                              <Loader2 className="mr-1 animate-spin" size={12} />
                              Buscando...
                            </>
                          ) : (
                            <>
                              <ScanFace className="mr-1" size={12} />
                              Encontrar Minhas Fotos
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 text-xs bg-transparent"
                          onClick={() => handleEventClick(event)}
                        >
                          Ver Todas as Fotos
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/*botão topo*/}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 bg-purple-600 hover:brightness-90 active:scale-95 transition-transform hover:scale-105 text-white p-3 rounded-full shadow-lg transition-all"
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={20} />
        </button>
      )}
      <BottomNavigationBar />
    </div>
  )
}
