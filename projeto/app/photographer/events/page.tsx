"use client"

import { useState, useCallback } from "react"
import { 
  Calendar, 
  MapPin, 
  Camera, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Search, 
  Filter,
  Eye,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  Tag,
  Home,
  Settings,
  LogOut,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Componente Sidebar
function Sidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "events", label: "Meus eventos", icon: Calendar },
    { id: "photos", label: "Minhas fotos", icon: Camera },
    { id: "profile", label: "Perfil", icon: Settings }
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-30">
      <div className="p-6">
        {/* Header com foto do perfil */}
        <div className="flex items-center space-x-3 mb-8">
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-gray-900">João Silva</h2>
            <p className="text-sm text-gray-500">Fotógrafo Profissional</p>
          </div>
        </div>

        {/* Menu de navegação */}
        <nav className="space-y-2">
          {menuItems.map((item) => { 
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Botão de logout */}
        <div className="mt-auto pt-8">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Dados mockados para eventos participados
const participatedEvents = [
  {
    id: 1,
    name: "Maratona São Paulo 2024",
    date: "2024-01-15",
    location: "São Paulo, SP",
    photosSent: 450,
    photosSold: 89,
    revenue: 2225.00,
    status: "published",
    statusLabel: "Publicado",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Corrida 5K Parque Ibirapuera",
    date: "2024-01-10",
    location: "São Paulo, SP",
    photosSent: 320,
    photosSold: 45,
    revenue: 900.00,
    status: "published",
    statusLabel: "Publicado",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Formatura Medicina UFMG",
    date: "2023-12-20",
    location: "Belo Horizonte, MG",
    photosSent: 280,
    photosSold: 67,
    revenue: 1675.00,
    status: "published",
    statusLabel: "Publicado",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Festival de Música Indie",
    date: "2023-12-15",
    location: "Rio de Janeiro, RJ",
    photosSent: 180,
    photosSold: 23,
    revenue: 575.00,
    status: "pending",
    statusLabel: "Aguardando Aprovação",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop"
  },
  {
    id: 5,
    name: "Copa Universitária 2023",
    date: "2023-11-30",
    location: "Brasília, DF",
    photosSent: 520,
    photosSold: 134,
    revenue: 3350.00,
    status: "published",
    statusLabel: "Publicado",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  {
    id: 6,
    name: "Evento Teste Rejeitado",
    date: "2023-11-15",
    location: "São Paulo, SP",
    photosSent: 0,
    photosSold: 0,
    revenue: 0.00,
    status: "rejected",
    statusLabel: "Rejeitado",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop"
  }
]

// Dados mockados para eventos futuros
const futureEvents = [
  {
    id: 7,
    name: "Maratona Rio de Janeiro 2024",
    date: "2024-02-20",
    location: "Rio de Janeiro, RJ",
    estimatedAudience: 5000,
    avgSalesPerPhotographer: 120,
    photographerPosition: "Top 3",
    demand: "high",
    demandLabel: "Alta Demanda",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  {
    id: 8,
    name: "Festival de Tecnologia SP",
    date: "2024-03-15",
    location: "São Paulo, SP",
    estimatedAudience: 3000,
    avgSalesPerPhotographer: 85,
    photographerPosition: "Top 5",
    demand: "medium",
    demandLabel: "Média Demanda",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop"
  },
  {
    id: 9,
    name: "Corrida das Flores",
    date: "2024-04-10",
    location: "Curitiba, PR",
    estimatedAudience: 2500,
    avgSalesPerPhotographer: 95,
    photographerPosition: "Top 2",
    demand: "high",
    demandLabel: "Alta Demanda",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  {
    id: 10,
    name: "Formatura Direito USP",
    date: "2024-05-25",
    location: "São Paulo, SP",
    estimatedAudience: 800,
    avgSalesPerPhotographer: 45,
    photographerPosition: "Top 1",
    demand: "low",
    demandLabel: "Baixo Índice de Fotógrafos",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop"
  }
]

export default function PhotographerEventsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("events")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("participated")
  const [searchTerm, setSearchTerm] = useState("")
  const [periodFilter, setPeriodFilter] = useState("all")

  const handleTabChange = useCallback((tab: string) => {
    if (tab === "dashboard") {
      router.push("/photographer/dashboard")
    } else if (tab === "photos") {
      router.push("/photographer/photos")
    } else if (tab === "profile") {
      router.push("/photographer/profile")
    } else {
      setActiveTab(tab)
    }
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewPerformance = (eventName: string) => {
    router.push(`/photographer/dashboard?event=${encodeURIComponent(eventName)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Conteúdo Principal */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 italic">Meus Eventos</h1>
                <p className="text-sm text-gray-600">Gerencie seus eventos e descubra novas oportunidades</p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Busca */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar eventos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-2">
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os períodos</SelectItem>
                      <SelectItem value="last6months">Últimos 6 meses</SelectItem>
                      <SelectItem value="currentyear">Ano atual</SelectItem>
                      <SelectItem value="upcoming">Próximos eventos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tabs de seções */}
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setActiveSection("participated")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "participated"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Eventos Participados
              </button>
              <button
                onClick={() => setActiveSection("future")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "future"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Eventos Futuros
              </button>
            </div>

            {/* Seção de Eventos Participados */}
            {activeSection === "participated" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Eventos Participados</h2>
                  <p className="text-sm text-gray-500">{participatedEvents.length} eventos</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {participatedEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={event.image}
                          alt={event.name}
                          fill
                          className="object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                        <Badge className={`absolute top-3 right-3 ${getStatusColor(event.status)}`}>
                          {event.statusLabel}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{event.name}</h3>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                          <div className="bg-blue-50 p-2 rounded">
                            <p className="text-xs text-blue-600 font-medium">{event.photosSent}</p>
                            <p className="text-xs text-blue-500">Fotos Enviadas</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <p className="text-xs text-green-600 font-medium">{event.photosSold}</p>
                            <p className="text-xs text-green-500">Fotos Vendidas</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <p className="text-xs text-purple-600 font-medium">R$ {event.revenue.toFixed(0)}</p>
                            <p className="text-xs text-purple-500">Receita</p>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleViewPerformance(event.name)}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Desempenho Detalhado
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Seção de Eventos Futuros */}
            {activeSection === "future" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Eventos Futuros em Potencial</h2>
                  <p className="text-sm text-gray-500">{futureEvents.length} sugestões</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {futureEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={event.image}
                          alt={event.name}
                          fill
                          className="object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                        <Badge className={`absolute top-3 right-3 ${getDemandColor(event.demand)}`}>
                          {event.demandLabel}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{event.name}</h3>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Público Estimado:</span>
                            <span className="font-medium">{event.estimatedAudience.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Média de Vendas:</span>
                            <span className="font-medium">{event.avgSalesPerPhotographer} fotos</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Sua Posição:</span>
                            <span className="font-medium text-purple-600">{event.photographerPosition}</span>
                          </div>
                        </div>

                        <Button 
                          variant="outline"
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tenho Interesse
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 