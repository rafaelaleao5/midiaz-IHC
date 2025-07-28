"use client"

import { useState } from "react"
import { Camera, TrendingUp, Eye, DollarSign, AlertTriangle, Lightbulb, Upload, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"

export default function PhotographerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const stats = {
    totalPhotos: 2450,
    totalViews: 45230,
    totalSales: 189,
    totalRevenue: 2835.0,
    conversionRate: 4.2,
    avgPhotoPrice: 15.0,
  }

  const recentEvents = [
    {
      id: 1,
      name: "Copa Universitária 2024",
      date: "15 Dez",
      photos: 1250,
      views: 15420,
      sales: 89,
      revenue: 1335.0,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "Formatura Medicina UFMG",
      date: "12 Dez",
      photos: 890,
      views: 8930,
      sales: 45,
      revenue: 675.0,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      name: "Festival de Música Indie",
      date: "10 Dez",
      photos: 310,
      views: 2180,
      sales: 12,
      revenue: 180.0,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const aiInsights = [
    {
      id: 1,
      type: "warning",
      title: "Foto com alta visualização",
      description: "Foto #1247 tem 234 visualizações mas nenhuma venda. Considere reduzir o preço.",
      action: "Ajustar Preço",
      photo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      type: "success",
      title: "Tendência positiva",
      description: "Fotos de comemoração estão vendendo 40% mais que a média.",
      action: "Ver Análise",
      photo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      type: "info",
      title: "Sugestão de preço",
      description: "Baseado no mercado, suas fotos poderiam custar até R$ 18,00.",
      action: "Aplicar Sugestão",
      photo: "/placeholder.svg?height=40&width=40",
    },
  ]

  const topPhotos = [
    { id: 1, image: "/placeholder.svg?height=80&width=80", views: 456, sales: 12, revenue: 180.0 },
    { id: 2, image: "/placeholder.svg?height=80&width=80", views: 389, sales: 10, revenue: 150.0 },
    { id: 3, image: "/placeholder.svg?height=80&width=80", views: 334, sales: 9, revenue: 135.0 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 italic">Painel do Fotógrafo</h1>
                <p className="text-sm text-gray-600">João Silva Photography</p>
              </div>
              <Link href="/photographer/upload" passHref>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Upload className="mr-2" size={16} />
                  Upload
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Camera className="mx-auto mb-2 text-purple-600" size={24} />
                <p className="text-2xl font-bold text-gray-900">{stats.totalPhotos.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total de Fotos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Visualizações</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="mx-auto mb-2 text-green-600" size={24} />
                <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                <p className="text-xs text-gray-600">Vendas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="mx-auto mb-2 text-yellow-600" size={24} />
                <p className="text-2xl font-bold text-gray-900">R$ {stats.totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-gray-600">Receita</p>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic flex items-center justify-between">
                Taxa de Conversão
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{stats.conversionRate}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.conversionRate * 10} className="mb-2" />
              <p className="text-sm text-gray-600">
                {stats.totalSales} vendas de {stats.totalViews.toLocaleString()} visualizações
              </p>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic flex items-center">
                <Lightbulb className="mr-2 text-yellow-500" size={20} />
                Insights Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Image
                    src={insight.photo || "/placeholder.svg"}
                    alt="Foto"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {insight.type === "warning" && <AlertTriangle size={14} className="text-orange-500" />}
                      {insight.type === "success" && <TrendingUp size={14} className="text-green-500" />}
                      {insight.type === "info" && <Lightbulb size={14} className="text-blue-500" />}
                      <p className="font-medium text-sm text-gray-900">{insight.title}</p>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                    <Button size="sm" variant="outline" className="text-xs h-6 bg-transparent">
                      {insight.action}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Events Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic flex items-center">
                <BarChart3 className="mr-2" size={20} />
                Performance por Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.name}
                      width={50}
                      height={50}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{event.name}</p>
                      <p className="text-xs text-gray-600">
                        {event.date} • {event.photos} fotos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600 text-sm">R$ {event.revenue.toFixed(0)}</p>
                      <p className="text-xs text-gray-600">{event.sales} vendas</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-xs text-blue-600 font-medium">{event.views.toLocaleString()}</p>
                      <p className="text-xs text-blue-500">Visualizações</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-xs text-green-600 font-medium">{event.sales}</p>
                      <p className="text-xs text-green-500">Vendas</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="text-xs text-purple-600 font-medium">
                        {((event.sales / event.views) * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-purple-500">Conversão</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Performing Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Fotos Mais Vendidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPhotos.map((photo, index) => (
                  <div key={photo.id} className="flex items-center space-x-3">
                    <Badge className="bg-purple-600 hover:bg-purple-700 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <Image
                      src={photo.image || "/placeholder.svg"}
                      alt={`Foto ${photo.id}`}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Foto #{photo.id}</p>
                      <p className="text-xs text-gray-600">{photo.views} visualizações</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600 text-sm">R$ {photo.revenue.toFixed(0)}</p>
                      <p className="text-xs text-gray-600">{photo.sales} vendas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent">
              <Upload className="mr-2" size={16} />
              Novo Upload
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent">
              <DollarSign className="mr-2" size={16} />
              Ajustar Preços
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
