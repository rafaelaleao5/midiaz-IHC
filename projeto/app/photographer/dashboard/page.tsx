"use client"

import React, { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  BarChart3, 
  Camera, 
  Calendar, 
  DollarSign, 
  Eye, 
  Home, 
  LogOut, 
  Menu, 
  Package, 
  Settings, 
  TrendingUp,
  Users,
  Upload,
  Star,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import Image from "next/image"

// Dados mockados para o dashboard
const mockEvents = [
  { id: "all", name: "Todos os eventos" },
  { id: "event-1", name: "Maratona Internacional SP" },
  { id: "event-2", name: "Formatura Medicina UFMG" },
  { id: "event-3", name: "Festival de Música Indie" },
  { id: "event-4", name: "Casamento Marina & Rafael" },
  { id: "event-5", name: "Campeonato Paulista de Futebol" }
]

const mockSalesData = [
  { date: "01/01", vendas: 12, visualizacoes: 150 },
  { date: "02/01", vendas: 8, visualizacoes: 120 },
  { date: "03/01", vendas: 15, visualizacoes: 200 },
  { date: "04/01", vendas: 22, visualizacoes: 280 },
  { date: "05/01", vendas: 18, visualizacoes: 220 },
  { date: "06/01", vendas: 25, visualizacoes: 320 },
  { date: "07/01", vendas: 30, visualizacoes: 400 }
]

const mockTopPhotos = [
  {
    id: 1,
    title: "Momento da chegada",
    event: "Maratona Internacional SP",
    sales: 45,
    views: 1200,
    revenue: 225.00,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=100&fit=crop"
  },
  {
    id: 2,
    title: "Celebração da vitória",
    event: "Maratona Internacional SP",
    sales: 38,
    views: 980,
    revenue: 190.00,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=100&fit=crop"
  },
  {
    id: 3,
    title: "Formatura em família",
    event: "Formatura Medicina UFMG",
    sales: 32,
    views: 850,
    revenue: 160.00,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&h=100&fit=crop"
  },
  {
    id: 4,
    title: "Show principal",
    event: "Festival de Música Indie",
    sales: 28,
    views: 720,
    revenue: 140.00,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=150&h=100&fit=crop"
  },
  {
    id: 5,
    title: "Primeiro beijo",
    event: "Casamento Marina & Rafael",
    sales: 25,
    views: 680,
    revenue: 125.00,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=150&h=100&fit=crop"
  }
]

const mockPhotos = [
  {
    id: 1,
    title: "Momento da chegada",
    event: "Maratona Internacional SP",
    uploadDate: "2024-12-15",
    sales: 45,
    views: 1200,
    revenue: 225.00,
    status: "active",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=100&fit=crop"
  },
  {
    id: 2,
    title: "Celebração da vitória",
    event: "Maratona Internacional SP",
    uploadDate: "2024-12-15",
    sales: 38,
    views: 980,
    revenue: 190.00,
    status: "active",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=100&fit=crop"
  },
  {
    id: 3,
    title: "Formatura em família",
    event: "Formatura Medicina UFMG",
    uploadDate: "2024-12-12",
    sales: 32,
    views: 850,
    revenue: 160.00,
    status: "active",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&h=100&fit=crop"
  },
  {
    id: 4,
    title: "Show principal",
    event: "Festival de Música Indie",
    uploadDate: "2024-12-10",
    sales: 28,
    views: 720,
    revenue: 140.00,
    status: "active",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=150&h=100&fit=crop"
  },
  {
    id: 5,
    title: "Primeiro beijo",
    event: "Casamento Marina & Rafael",
    uploadDate: "2024-12-07",
    sales: 25,
    views: 680,
    revenue: 125.00,
    status: "active",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=150&h=100&fit=crop"
  }
]

// Componente da Sidebar
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
          {menuItems.map((item) => { const Icon = item.icon
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

// Componente de Card de Métrica
function MetricCard({ title, value, icon: Icon, trend, trendValue, color = "purple" }: {
  title: string
  value: string | number
  icon: any
  trend?: "up" | "down"
  trendValue?: string
  color?: string
}) {
  return (
    <Card className="rounded-2xl shadow-sm border-0 bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className={`w-4 h-4 ${trend === "up" ? "text-green-500" : "text-red-500"}`} />
                <span className={`text-sm ml-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-${color}-50`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente do Dashboard
function DashboardContent({ selectedEvent }: { selectedEvent: string }) {
  // Calcular métricas baseadas no evento selecionado
  const getMetrics = () => {
    if (selectedEvent === "all") {
      return {
        totalEvents: 5,
        totalPhotos: 1250,
        monthlySales: 168,
        totalRevenue: 840.00,
        topPhotoViews: 1200
      }
    } else {
      return {
        totalEvents: 1,
        totalPhotos: 250,
        monthlySales: 45,
        totalRevenue: 225.00,
        topPhotoViews: 1200
      }
    }
  }

  const metrics = getMetrics()

  // Dados mockados para últimas vendas
  const recentSales = [
    {
      id: 1,
      photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=100&fit=crop",
      eventName: "Maratona São Paulo 2024",
      soldAt: "2024-01-15T14:30:00",
      price: 25.00,
      views: 156,
      customerName: "Maria Silva"
    },
    {
      id: 2,
      photoUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=100&fit=crop",
      eventName: "Corrida 5K Parque Ibirapuera",
      soldAt: "2024-01-14T16:45:00",
      price: 20.00,
      views: 89,
      customerName: "João Santos"
    },
    {
      id: 3,
      photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=100&fit=crop",
      eventName: "Maratona São Paulo 2024",
      soldAt: "2024-01-14T11:20:00",
      price: 25.00,
      views: 203,
      customerName: "Ana Costa"
    },
    {
      id: 4,
      photoUrl: "https://images.unsplash.com/photo-1551698618-1cb2f97d256?w=150&h=100&fit=crop",
      eventName: "Corrida 5K Parque Ibirapuera",
      soldAt: "2024-01-13T09:15:00",
      price: 20.00,
      views: 67,
      customerName: "Pedro Lima"
    },
    {
      id: 5,
      photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=100&fit=crop",
      eventName: "Maratona São Paulo 2024",
      soldAt: "2024-01-12T15:30:00",
      price: 25.00,
      views: 178,
      customerName: "Carla Oliveira"
    }
  ]

  // Filtrar vendas baseado no evento selecionado
  const filteredSales = selectedEvent === "all" 
    ? recentSales 
    : recentSales.filter(sale => sale.eventName === selectedEvent)

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Eventos Participados"
          value={metrics.totalEvents}
          icon={Calendar}
          trend="up"
          trendValue="+2 este mês"
        />
        <MetricCard
          title="Fotos Enviadas"
          value={metrics.totalPhotos}
          icon={Camera}
          trend="up"
          trendValue="+15% vs mês anterior"
        />
        <MetricCard
          title="Fotos Vendidas (Mês)"
          value={metrics.monthlySales}
          icon={Package}
          trend="up"
          trendValue="+8% vs mês anterior"
        />
        <MetricCard
          title="Receita Total"
          value={`R$ ${metrics.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend="up"
          trendValue="+12% vs mês anterior"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vendas */}
        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Vendas por Dia</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Visualizações */}
        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <span>Visualizações por Dia</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visualizacoes" stroke="#9333ea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ranking de Fotos */}
      <Card className="rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-purple-600" />
            <span>Fotos Mais Vendidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTopPhotos.map((photo, index) => (
              <div key={photo.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <Badge className="bg-purple-100 text-purple-800">#{index + 1}</Badge>
                </div>
                <img 
                  src={photo.image} 
                  alt={photo.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{photo.title}</h4>
                  <p className="text-sm text-gray-500">{photo.event}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{photo.sales} vendas</p>
                  <p className="text-sm text-gray-500">{photo.views} visualizações</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">R$ {photo.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seção de Últimas Vendas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Últimas vendas para este evento
          </h3>
          <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
            Ver todas
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredSales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                  {/* Miniatura da foto */}
                  <div className="relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={sale.photoUrl}
                      alt="Foto vendida"
                      fill
                      className="object-cover"
                                             onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                         const target = e.target as HTMLImageElement
                         target.src = "/placeholder.svg"
                       }}
                    />
                  </div>
                  
                  {/* Informações da venda */}
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {sale.customerName}
                        </p>
                        {selectedEvent === "all" && (
                          <p className="text-xs text-gray-500 truncate">
                            {sale.eventName}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">
                          R$ {sale.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(sale.soldAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="w-3 h-3 mr-1" />
                        {sale.views} visualizações
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(sale.soldAt).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredSales.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma venda encontrada para este evento</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Página principal do Dashboard
export default function PhotographerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedEvent, setSelectedEvent] = useState("all")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Verificar se há parâmetro de evento na URL
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const eventParam = urlParams.get('event')
      if (eventParam) {
        setSelectedEvent(eventParam)
      }
    }
  }, [])

  const handleTabChange = useCallback((tab: string) => {
    if (tab === "events") {
      router.push("/photographer/events")
    } else if (tab === "photos") {
      router.push("/photographer/photos")
    } else if (tab === "profile") {
      router.push("/photographer/profile")
    } else {
      setActiveTab(tab)
    }
  }, [router])

  const handleEventChange = useCallback((eventId: string) => {
    setSelectedEvent(eventId)
  }, [])

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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            {/* Filtro de Evento */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filtrar por evento:</span>
              </div>
              <Select value={selectedEvent} onValueChange={handleEventChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  {mockEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Conteúdo do Dashboard */}
        <main className="p-6">
          {activeTab === "dashboard" && (
            <DashboardContent selectedEvent={selectedEvent} />
          )}
          
          {activeTab === "events" && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Meus Eventos</h3>
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          
          {activeTab === "photos" && (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Minhas Fotos</h3>
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          
          {activeTab === "profile" && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil</h3>
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
