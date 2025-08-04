"use client"

import { Search, ArrowRight, ChevronLeft, ChevronRight, User, MapPin, Calendar, Heart, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar"
import { useApp } from "@/contexts/AppContext"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"

// Componente de carrossel reutilizável estilo Netflix
interface CarouselSectionProps {
  title: string
  items: any[]
  onItemClick: (item: any) => void
  onViewAll: () => void
  showViewAll?: boolean
  icon?: React.ReactNode
  isUserSection?: boolean
}

function CarouselSection({ title, items, onItemClick, onViewAll, showViewAll = true, icon, isUserSection = false }: CarouselSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const itemsPerSlide = 4
  const totalSlides = Math.ceil(items.length / itemsPerSlide)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  // Não renderizar se não há itens
  if (items.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-purple-600">{icon}</span>}
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        {showViewAll && (
          <Button
            variant="ghost"
            className="text-purple-600 hover:text-purple-700"
            onClick={onViewAll}
          >
            Ver todas <ArrowRight size={16} className="ml-1" />
          </Button>
        )}
      </div>

      <div className="relative group">
        {/* Carousel Container with proper spacing */}
        <div className="carousel-container px-12">
          <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {Array.from({ length: totalSlides }, (_, slideIndex) => (
              <div key={slideIndex} className="carousel-slide">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((item) => (
                    <Card
                      key={item.id}
                      className="event-card overflow-hidden cursor-pointer h-full"
                      onClick={() => onItemClick(item)}
                    >
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="relative aspect-[4/3] flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                          <Badge className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700 text-xs">
                            {item.totalPhotos} fotos
                          </Badge>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between min-h-0">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2 leading-tight">{item.name}</h3>
                            <div className="flex items-center text-xs text-gray-600 mb-2">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="line-clamp-1">{item.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span>{item.date}</span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-xs px-3 py-1 h-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                onItemClick(item)
                              }}
                            >
                              {isUserSection ? "Ver minhas fotos" : "Ver"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation - Positioned outside cards */}
        {totalSlides > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="absolute left-[-24px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg z-10 border-gray-200 rounded-full w-10 h-10"
              onClick={prevSlide}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-[-24px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg z-10 border-gray-200 rounded-full w-10 h-10"
              onClick={nextSlide}
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}

        {/* Carousel Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => handleSlideClick(index)}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { events, setSearchQuery, setSelectedEvent, user } = useApp()
  const router = useRouter()

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    router.push("/search")
  }, [setSearchQuery, router])

  const handleEventClick = useCallback((event: any) => {
    setSelectedEvent(event)
    router.push(`/event/${event.id}`)
  }, [setSelectedEvent, router])

  // Dados mockados para as diferentes sessões
  const featuredEvents = events.slice(0, 8) // Eventos em Destaque

  // Eventos próximos ao usuário (mock baseado em localização)
  const nearbyEvents = [
    {
      id: "nearby-1",
      name: "Maratona Internacional São Paulo",
      location: "São Paulo, SP",
      date: "15 de Janeiro, 2025",
      totalPhotos: 2500,
      image: "https://www.yescom.com.br/gerenciador/uploads/noticia_184661419.jpg"
    },
    {
      id: "nearby-2",
      name: "Campeonato Paulista de Futebol",
      location: "São Paulo, SP",
      date: "12 de Janeiro, 2025",
      totalPhotos: 1800,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSN2pzCptR0asMi00bm7y9psfJkqpY_CBNVw&s"
    },
    {
      id: "nearby-3",
      name: "Festival de Música Indie",
      location: "São Paulo, SP",
      date: "10 de Janeiro, 2025",
      totalPhotos: 1200,
      image: "https://sebrae.com.br/Sebrae/Portal%20Sebrae/UFs/PE/Imagens/sebraepe_sebraepe_image_4.jpeg"
    },
    {
      id: "nearby-4",
      name: "Corrida Noturna 10K",
      location: "São Paulo, SP",
      date: "8 de Janeiro, 2025",
      totalPhotos: 900,
      image: "https://s3.sa-east-1.amazonaws.com/static.activodeporte.com/brasil/uploads/2024/05/06121758/%40bruno.barrosh-43-1-690x515.jpg"
    },
    {
      id: "nearby-5",
      name: "Show Rock Nacional",
      location: "São Paulo, SP",
      date: "5 de Janeiro, 2025",
      totalPhotos: 1500,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop"
    },
    {
      id: "nearby-6",
      name: "Torneio de Tênis",
      location: "São Paulo, SP",
      date: "3 de Janeiro, 2025",
      totalPhotos: 800,
      image: "https://blog.lptennis.com/content/images/2016/11/novak-djokovic.jpg"
    },
    {
      id: "nearby-7",
      name: "Conferência Tech Brasil",
      location: "São Paulo, SP",
      date: "1 de Janeiro, 2025",
      totalPhotos: 1100,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"
    },
    {
      id: "nearby-8",
      name: "Festival Gastronômico",
      location: "São Paulo, SP",
      date: "30 de Dezembro, 2024",
      totalPhotos: 750,
      image: "https://www.estadao.com.br/resizer/v2/L6HDJTYTEJHB5FD5TROB3BLZ4Y.jpg?quality=80&auth=4d260b39db5ca1df99f03af2486787c73fb2b3fba48fd7475320f519925d82bc&width=1075&height=527&focal=1833,1779"
    }
  ]

  // Seus últimos eventos (mock para usuário logado)
  const userLastEvents = user ? [
    {
      id: "last-1",
      name: "Formatura Medicina UFMG",
      location: "Belo Horizonte, MG",
      date: "20 de Dezembro, 2024",
      totalPhotos: 450,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop"
    },
    {
      id: "last-2",
      name: "Casamento Marina & Rafael",
      location: "Campinas, SP",
      date: "15 de Dezembro, 2024",
      totalPhotos: 320,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop"
    },
    {
      id: "last-3",
      name: "Maratona Internacional SP",
      location: "São Paulo, SP",
      date: "10 de Dezembro, 2024",
      totalPhotos: 1800,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    },
    {
      id: "last-4",
      name: "Festival Gastronômico",
      location: "São Paulo, SP",
      date: "5 de Dezembro, 2024",
      totalPhotos: 280,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"
    },
    {
      id: "last-5",
      name: "Show Rock Nacional",
      location: "São Paulo, SP",
      date: "1 de Dezembro, 2024",
      totalPhotos: 1200,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop"
    },
    {
      id: "last-6",
      name: "Copa Universitária 2024",
      location: "São Paulo, SP",
      date: "25 de Novembro, 2024",
      totalPhotos: 950,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop"
    },
    {
      id: "last-7",
      name: "Conferência Tech Brasil 2024",
      location: "Rio de Janeiro, RJ",
      date: "20 de Novembro, 2024",
      totalPhotos: 1100,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"
    },
    {
      id: "last-8",
      name: "Campeonato Estadual de Tênis",
      location: "São Paulo, SP",
      date: "15 de Novembro, 2024",
      totalPhotos: 680,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    }
  ] : []

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16 md:pb-0 pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden w-full px-4 md:px-8 bg-gradient-to-r from-purple-600 to-purple-800">
        {/* User Profile Picture */}
        {user && (
          <div className="absolute top-4 left-4 z-20">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-8 leading-tight">
            Descubra fotos profissionais dos seus melhores momentos
          </h1>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="h-6 w-6 text-white/80" />
              </div>
              <Input
                placeholder="Pesquise suas fotos..."
                className="w-full pl-12 pr-4 py-4 text-lg border-0 bg-white/20 backdrop-blur-md rounded-xl shadow-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-white/70 text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch((e.target as HTMLInputElement).value)
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">

          {/* 1. Eventos em Destaque */}
          <CarouselSection
            title="Eventos em Destaque"
            items={featuredEvents}
            onItemClick={handleEventClick}
            onViewAll={() => router.push("/search")}
            icon={<Star className="w-5 h-5" />}
          />

          {/* 2. Eventos próximos a você */}
          <CarouselSection
            title="Eventos próximos a você"
            items={nearbyEvents}
            onItemClick={handleEventClick}
            onViewAll={() => router.push("/search")}
            icon={<MapPin className="w-5 h-5" />}
          />

          {/* 3. Seus últimos eventos */}
          {user && userLastEvents.length > 0 && (
            <CarouselSection
              title="Seus últimos eventos"
              items={userLastEvents}
              onItemClick={handleEventClick}
              onViewAll={() => router.push("/account")}
              icon={<Clock className="w-5 h-5" />}
              isUserSection={true}
            />
          )}

        </div>
      </div>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a <span className="text-purple-600">Midiaz</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A plataforma mais avançada para encontrar e comprar suas fotos profissionais
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">+50k</div>
              <p className="text-gray-600">Fotos disponíveis</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">4.9</div>
              <p className="text-gray-600">Avaliação média</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">+1k</div>
              <p className="text-gray-600">Eventos cadastrados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">200+</div>
              <p className="text-gray-600">Fotógrafos parceiros</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Pronto para encontrar suas fotos?</h2>
          <p className="text-xl mb-8 text-purple-100">Cadastre-se gratuitamente e descubra suas memórias em segundos</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
              onClick={() => router.push("/register")}
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent px-8 py-3"
              onClick={() => router.push("/search")}
            >
              Buscar Eventos
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">MZ</span>
            </div>
            <span className="font-bold">Midiaz</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Plataforma inteligente de descoberta e venda de fotos profissionais
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Sobre
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contato
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Termos
            </a>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavigationBar />
    </div>
  )
}

