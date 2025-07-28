"use client"

import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar" // Importar a nova barra de navegação
import { useApp } from "@/contexts/AppContext"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Real sports photos URLs for mosaic background
const mosaicPhotos = [
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop", // Football
  "https://plus.unsplash.com/premium_photo-1685231505216-720690ca7cc9?q=80&w=687&auto=format&fit=crop", // Basketball
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&fit=crop", // Running
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fit=crop", // Tennis
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fit=crop", // Cycling
  "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400&fit=crop", // Soccer
  "https://plus.unsplash.com/premium_photo-1671100502325-8870ff9ba5c9?w=600&fit=crop", // Volleyball
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&fit=crop", // Ski
  "https://images.unsplash.com/photo-1519021228607-ef6e4c22d821?w=600&fit=crop", // Gym
  "https://images.unsplash.com/photo-1613937574892-25f441264a09?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Corrida substituta
  "https://images.unsplash.com/photo-1597019558926-3eef445fdf60?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Maratona substituta
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&fit=crop", // Yoga
  "https://images.unsplash.com/photo-1559627755-42212e5c5fdf?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Futebol society
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=600&fit=crop", // Basquete indoor
  "https://images.unsplash.com/photo-1550439062-609e1531270e?w=600&fit=crop", // Natação
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&fit=crop", // Corrida noturna
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1687960619494-5b55f6604d14?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1516903150729-a7c4d5cf070d?q=80&w=681&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1730816447853-192e89120832?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1480179087180-d9f0ec044897?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1711751129036-2224bb99621e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]





export default function HomePage() {
  const { events, setSearchQuery, setSelectedEvent } = useApp()
  const router = useRouter()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    router.push("/search")
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    router.push(`/event/${event.id}`)
  }

  return (
  <div className="min-h-screen w-full bg-white pb-16 md:pb-0">
      {" "}
      {/* Added pb-16 for bottom bar */}
      <Navigation />
      {/* Hero Section with Mosaic Background */}
      <section className="relative h-[700px] flex items-center justify-between md:justify-start overflow-hidden w-full px-4 md:px-8">
        {/* Mosaic Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {" "}
            {/* Adjusted gap */}
            {mosaicPhotos.map((photo, index) => (
              <div key={index} className="relative overflow-hidden aspect-square rounded-md">
                {" "}
                {/* Added aspect-square */}
                <Image
                  src={photo || "/placeholder.svg"}
                  alt="" // Decorative image for accessibility
                  fill // Use fill for responsive square images
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          {/* Darker overlay */}
          <div className="absolute inset-0 bg-black/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-20">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-8 leading-tight lg:text-4xl px-0">
            {" "}
            {/* Adjusted font size for mobile and desktop */}
            Descubra fotos profissionais dos seus melhores momentos
          </h1>

          {/* Search Bar - Improved Design */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="h-6 w-6 text-white/80" /> {/* Larger icon */}
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
      {/* Events Section - Higher up to show half of first row */}
      <section className="relative -mt-48 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[2000px] mx-auto">
          <div className="bg-white rounded-t-3xl shadow-2xl pt-8 lg:pt-12">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 italic">Eventos em Destaque</h2>
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700"
                  onClick={() => router.push("/search")}
                >
                  Ver todos <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>

              {/* Events Grid - Partially Cut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 pb-8"> {/*aaaaaalterei aqui*/}
                {events.slice(0, 8).map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => handleEventClick(event)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.name}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700">
                          {event.totalPhotos} fotos
                        </Badge>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{event.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{event.date}</span>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Ver Fotos
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Additional Events - Continuation */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-white">
        <div className="max-w-[2000px] mx-auto">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {events.slice(8, 16).map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleEventClick(event)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700">
                        {event.totalPhotos} fotos
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{event.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{event.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{event.date}</span>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Ver Fotos
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 italic">
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
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 italic">Pronto para encontrar suas fotos?</h2>
          <p className="text-xl mb-8 text-purple-100">Cadastre-se gratuitamente e descubra suas memórias em segundos</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
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
            <span className="font-bold italic">Midiaz</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Plataforma inteligente de descoberta e venda de fotos profissionais
          </p>
          <div className="flex justify-between space-x-6 text-sm text-gray-400">
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
