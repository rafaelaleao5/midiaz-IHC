"use client"

import { useState, useCallback } from "react"
import { 
  Camera, 
  Search, 
  Filter,
  Download,
  Eye,
  Star,
  Calendar,
  MapPin,
  Home,
  Calendar as CalendarIcon,
  Settings,
  LogOut,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Dados mockados para fotos
const mockPhotos = [
  {
    id: 1,
    title: "Momento da chegada",
    event: "Maratona São Paulo 2024",
    date: "2024-01-15",
    location: "São Paulo, SP",
    views: 156,
    sales: 3,
    revenue: 75.00,
    status: "active",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Celebração da vitória",
    event: "Maratona São Paulo 2024",
    date: "2024-01-15",
    location: "São Paulo, SP",
    views: 203,
    sales: 5,
    revenue: 125.00,
    status: "active",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    title: "Formatura em família",
    event: "Formatura Medicina UFMG",
    date: "2023-12-20",
    location: "Belo Horizonte, MG",
    views: 89,
    sales: 2,
    revenue: 50.00,
    status: "active",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Show no palco principal",
    event: "Festival de Música Indie",
    date: "2023-12-15",
    location: "Rio de Janeiro, RJ",
    views: 67,
    sales: 1,
    revenue: 25.00,
    status: "pending",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop"
  }
]

// Componente Sidebar
function Sidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "events", label: "Meus eventos", icon: CalendarIcon },
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

export default function PhotographerPhotosPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("photos")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")

  // Filtrar fotos
  const filteredPhotos = mockPhotos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || photo.status === statusFilter
    const matchesEvent = eventFilter === "all" || photo.event === eventFilter
    return matchesSearch && matchesStatus && matchesEvent
  })

  const handleTabChange = useCallback((tab: string) => {
    if (tab === "dashboard") {
      router.push("/photographer/dashboard")
    } else if (tab === "events") {
      router.push("/photographer/events")
    } else if (tab === "profile") {
      router.push("/photographer/profile")
    } else {
      setActiveTab(tab)
    }
  }, [router])

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
                <h1 className="text-xl font-bold text-gray-900 italic">Minhas Fotos</h1>
                <p className="text-sm text-gray-600">Gerencie suas fotos e acompanhe o desempenho</p>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Camera className="w-4 h-4 mr-2" />
              Upload de Fotos
            </Button>
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
                      placeholder="Buscar fotos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="pending">Aguardando</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os eventos</SelectItem>
                      <SelectItem value="Maratona São Paulo 2024">Maratona SP 2024</SelectItem>
                      <SelectItem value="Formatura Medicina UFMG">Formatura UFMG</SelectItem>
                      <SelectItem value="Festival de Música Indie">Festival Indie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Minhas Fotos</h2>
                <p className="text-sm text-gray-500">{filteredPhotos.length} fotos encontradas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        className="object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                      <Badge className={`absolute top-3 right-3 ${
                        photo.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {photo.status === "active" ? "Ativo" : "Aguardando"}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{photo.title}</h3>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(photo.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {photo.location}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="text-xs text-blue-600 font-medium">{photo.views}</p>
                          <p className="text-xs text-blue-500">Visualizações</p>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-xs text-green-600 font-medium">{photo.sales}</p>
                          <p className="text-xs text-green-500">Vendas</p>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <p className="text-xs text-purple-600 font-medium">R$ {photo.revenue.toFixed(0)}</p>
                          <p className="text-xs text-purple-500">Receita</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPhotos.length === 0 && (
                <div className="text-center py-12">
                  <Camera className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma foto encontrada</h3>
                  <p className="text-gray-500">Tente ajustar os filtros ou buscar por outro termo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 