"use client"

import { useState } from "react"
import { BarChart3, Users, Camera, DollarSign, TrendingUp, AlertTriangle, Eye, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const stats = {
    totalUsers: 12450,
    totalPhotographers: 89,
    totalPhotos: 156780,
    totalRevenue: 234500.0,
    monthlyGrowth: 15.3,
    activeEvents: 23,
  }

  const topPhotos = [
    {
      id: 1,
      image: "/placeholder.svg?height=60&width=60",
      event: "Copa Universitária",
      photographer: "João Silva",
      views: 2340,
      sales: 89,
      revenue: 1335.0,
    },
    {
      id: 2,
      image: "/placeholder.svg?height=60&width=60",
      event: "Formatura Medicina",
      photographer: "Ana Costa",
      views: 1890,
      sales: 67,
      revenue: 1005.0,
    },
    {
      id: 3,
      image: "/placeholder.svg?height=60&width=60",
      event: "Festival Indie",
      photographer: "Carlos Lima",
      views: 1560,
      sales: 45,
      revenue: 675.0,
    },
  ]

  const topPhotographers = [
    {
      id: 1,
      name: "João Silva Photography",
      avatar: "/placeholder.svg?height=40&width=40",
      events: 12,
      photos: 3450,
      revenue: 15670.0,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Ana Costa Fotografia",
      avatar: "/placeholder.svg?height=40&width=40",
      events: 8,
      photos: 2890,
      revenue: 12340.0,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Carlos Lima Studio",
      avatar: "/placeholder.svg?height=40&width=40",
      events: 6,
      photos: 1980,
      revenue: 8900.0,
      rating: 4.7,
    },
  ]

  const recentEvents = [
    {
      id: 1,
      name: "Copa Universitária 2024",
      date: "15 Dez",
      photographer: "João Silva",
      status: "active",
      photos: 1250,
      views: 15420,
    },
    {
      id: 2,
      name: "Formatura Medicina UFMG",
      date: "12 Dez",
      photographer: "Ana Costa",
      status: "completed",
      photos: 890,
      views: 8930,
    },
    {
      id: 3,
      name: "Festival de Música Indie",
      date: "10 Dez",
      photographer: "Carlos Lima",
      status: "review",
      photos: 310,
      views: 2180,
    },
  ]

  const moderationQueue = [
    {
      id: 1,
      photo: "/placeholder.svg?height=50&width=50",
      event: "Festa Universitária",
      photographer: "Pedro Santos",
      reason: "Conteúdo inapropriado reportado",
      reports: 3,
    },
    {
      id: 2,
      photo: "/placeholder.svg?height=50&width=50",
      event: "Show Rock",
      photographer: "Maria Oliveira",
      reason: "Qualidade da imagem questionada",
      reports: 1,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 italic">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Painel de Administração</p>
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                <Settings size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Usuários Ativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Camera className="mx-auto mb-2 text-purple-600" size={24} />
                <p className="text-2xl font-bold text-gray-900">{stats.totalPhotographers}</p>
                <p className="text-xs text-gray-600">Fotógrafos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="mx-auto mb-2 text-green-600" size={24} />
                <p className="text-2xl font-bold text-gray-900">{(stats.totalPhotos / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-600">Total de Fotos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="mx-auto mb-2 text-yellow-600" size={24} />
                <p className="text-2xl font-bold text-gray-900">R$ {(stats.totalRevenue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-600">Receita Total</p>
              </CardContent>
            </Card>
          </div>

          {/* Growth Indicator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic flex items-center justify-between">
                Crescimento Mensal
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">+{stats.monthlyGrowth}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="text-green-600" size={16} />
                <span className="text-sm text-gray-600">Crescimento consistente</span>
              </div>
              <Progress value={stats.monthlyGrowth * 5} className="mb-2" />
              <p className="text-xs text-gray-500">Baseado em novos usuários e receita dos últimos 30 dias</p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="photos">Fotos</TabsTrigger>
              <TabsTrigger value="photographers">Fotógrafos</TabsTrigger>
              <TabsTrigger value="moderation">Moderação</TabsTrigger>
            </TabsList>

            {/* Top Photos */}
            <TabsContent value="photos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic">Fotos Mais Vendidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topPhotos.map((photo, index) => (
                    <div key={photo.id} className="flex items-center space-x-3">
                      <Badge className="bg-purple-600 hover:bg-purple-700 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <Image
                        src={photo.image || "/placeholder.svg"}
                        alt={photo.event}
                        width={50}
                        height={50}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{photo.event}</p>
                        <p className="text-xs text-gray-600">{photo.photographer}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-500">
                            <Eye size={10} className="inline mr-1" />
                            {photo.views}
                          </span>
                          <span className="text-xs text-green-600 font-medium">{photo.sales} vendas</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600 text-sm">R$ {photo.revenue.toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic">Eventos Recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{event.name}</p>
                        <p className="text-xs text-gray-600">
                          {event.photographer} • {event.date}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.photos} fotos • {event.views.toLocaleString()} visualizações
                        </p>
                      </div>
                      <Badge
                        className={
                          event.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : event.status === "completed"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                        }
                      >
                        {event.status === "active" ? "Ativo" : event.status === "completed" ? "Concluído" : "Revisão"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Top Photographers */}
            <TabsContent value="photographers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic">Fotógrafos Top</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topPhotographers.map((photographer, index) => (
                    <div key={photographer.id} className="flex items-center space-x-3">
                      <Badge className="bg-purple-600 hover:bg-purple-700 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <Image
                        src={photographer.avatar || "/placeholder.svg"}
                        alt={photographer.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{photographer.name}</p>
                        <div className="flex items-center space-x-3 text-xs text-gray-600">
                          <span>{photographer.events} eventos</span>
                          <span>{photographer.photos.toLocaleString()} fotos</span>
                          <span className="text-yellow-600">★ {photographer.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600 text-sm">
                          R$ {(photographer.revenue / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Moderation Queue */}
            <TabsContent value="moderation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic flex items-center">
                    <AlertTriangle className="mr-2 text-orange-500" size={20} />
                    Fila de Moderação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {moderationQueue.map((item) => (
                    <div key={item.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-start space-x-3">
                        <Image
                          src={item.photo || "/placeholder.svg"}
                          alt="Foto para moderação"
                          width={50}
                          height={50}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-orange-900 text-sm">{item.event}</p>
                          <p className="text-xs text-orange-700 mb-1">{item.photographer}</p>
                          <p className="text-xs text-orange-800">{item.reason}</p>
                          <Badge className="mt-2 bg-red-100 text-red-800 hover:bg-red-100 text-xs">
                            {item.reports} report{item.reports > 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50 text-xs bg-transparent"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}

                  {moderationQueue.length === 0 && (
                    <div className="text-center py-8">
                      <AlertTriangle className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-gray-600">Nenhum item na fila de moderação</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent">
              <Users className="mr-2" size={16} />
              Gerenciar Usuários
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent">
              <BarChart3 className="mr-2" size={16} />
              Relatórios
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
