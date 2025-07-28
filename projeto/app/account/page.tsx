"use client"

import { useState } from "react"
import { User, Camera, Bell, Trophy, Download, Heart, Share2, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar" // Importar a nova barra de navegação
import { useApp } from "@/contexts/AppContext"
import Image from "next/image"

export default function AccountPage() {
  const [notifications, setNotifications] = useState({
    newPhotos: true,
    promotions: false,
    events: true,
  })

  const { user } = useApp()

  if (!user) {
    return (
      <div className="min-h-screen bg-white pb-16 md:pb-0">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Faça login para acessar sua conta</p>
        </div>
        <BottomNavigationBar />
      </div>
    )
  }

  const userData = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    joinDate: "Março 2024",
    totalPurchases: 15,
    favoriteEvents: 8,
    citiesWithPhotos: 5,
    eventTypes: ["Esportivo", "Acadêmico", "Social"],
  }

  const badges = [
    { id: 1, name: "Primeira Compra", icon: "🎯", earned: true, date: "Mar 2024" },
    { id: 2, name: "Colecionador", icon: "📸", earned: true, date: "Abr 2024" },
    {
      id: 3,
      name: "Explorador",
      icon: "🗺️",
      earned: true,
      date: "Mai 2024",
      description: "Fotos em 5 tipos de eventos diferentes",
    },
    {
      id: 4,
      name: "Viajante",
      icon: "✈️",
      earned: true,
      date: "Jun 2024",
      description: "Fotos em 3 estados diferentes",
    },
    { id: 5, name: "Campeão", icon: "🏆", earned: false, description: "Compre fotos de 10 competições" },
    { id: 6, name: "Networker", icon: "🤝", earned: false, description: "Fotos em 5 eventos corporativos" },
  ]

  const recentPurchases = [
    {
      id: 1,
      image: "/placeholder.svg?height=60&width=60&text=Photo1",
      event: "Copa Universitária",
      date: "15 Dez",
      photos: 3,
    },
    {
      id: 2,
      image: "/placeholder.svg?height=60&width=60&text=Photo2",
      event: "Formatura Medicina",
      date: "12 Dez",
      photos: 2,
    },
    {
      id: 3,
      image: "/placeholder.svg?height=60&width=60&text=Photo3",
      event: "Festival Indie",
      date: "10 Dez",
      photos: 1,
    },
  ]

  const photoAlerts = [
    { id: 1, event: "Maratona São Paulo", photos: 12, date: "Hoje" },
    { id: 2, event: "Show Rock in Rio", photos: 8, date: "Ontem" },
    { id: 3, event: "Casamento João & Ana", photos: 25, date: "2 dias" },
  ]

  const personalStats = [
    { label: "Cidades com fotos", value: userData.citiesWithPhotos, icon: "🌍" },
    { label: "Tipos de eventos", value: userData.eventTypes.length, icon: "🎭" },
    { label: "Fotos compradas", value: userData.totalPurchases, icon: "📸" },
    { label: "Eventos favoritos", value: userData.favoriteEvents, icon: "❤️" },
  ]

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navigation />

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white pt-16">
        {" "}
        {/* Added pt-16 for header spacing */}
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <Image
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-white/20"
              />
              <div className="flex-1">
                <h1 className="text-xl font-bold italic">{userData.name}</h1>
                <p className="text-purple-100 text-sm">{userData.email}</p>
                <p className="text-purple-200 text-xs">Membro desde {userData.joinDate}</p>
              </div>
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {personalStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-purple-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="purchases">Compras</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="badges">Conquistas</TabsTrigger>
            </TabsList>

            {/* Purchases Tab */}
            <TabsContent value="purchases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic flex items-center">
                    <Camera className="mr-2" size={20} />
                    Compras Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Image
                        src={purchase.image || "/placeholder.svg"}
                        alt={purchase.event}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{purchase.event}</p>
                        <p className="text-sm text-gray-600">
                          {purchase.photos} fotos • {purchase.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button size="sm" variant="ghost" className="text-xs text-purple-600 p-0 h-auto">
                          <Download size={12} className="mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full border-purple-600 text-purple-600 bg-transparent">
                    Ver Todas as Compras
                  </Button>
                </CardContent>
              </Card>

              {/* Journey Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic flex items-center">
                    <MapPin className="mr-2" size={20} />
                    Sua Jornada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Eventos por Tipo</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {userData.eventTypes.map((type, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-2xl">🎭</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Cidades Visitadas</p>
                        <p className="text-sm text-gray-600">São Paulo, Rio de Janeiro, Belo Horizonte...</p>
                      </div>
                      <div className="text-2xl">🌍</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic flex items-center">
                    <Bell className="mr-2" size={20} />
                    Novas Fotos Detectadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {photoAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{alert.event}</p>
                        <p className="text-sm text-green-700">{alert.photos} novas fotos com você</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">{alert.date}</p>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Ver Fotos
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic">Preferências de Notificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novas fotos detectadas</p>
                      <p className="text-sm text-gray-600">Quando encontrarmos você em novas fotos</p>
                    </div>
                    <Switch
                      checked={notifications.newPhotos}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newPhotos: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Promoções e ofertas</p>
                      <p className="text-sm text-gray-600">Descontos e campanhas especiais</p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, promotions: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novos eventos</p>
                      <p className="text-sm text-gray-600">Eventos próximos à sua localização</p>
                    </div>
                    <Switch
                      checked={notifications.events}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, events: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg italic flex items-center">
                    <Trophy className="mr-2" size={20} />
                    Suas Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border text-center ${
                          badge.earned
                            ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className={`text-2xl mb-2 ${!badge.earned ? "grayscale opacity-50" : ""}`}>
                          {badge.icon}
                        </div>
                        <p className={`font-medium text-sm mb-1 ${badge.earned ? "text-yellow-800" : "text-gray-600"}`}>
                          {badge.name}
                        </p>
                        {badge.earned ? (
                          <p className="text-xs text-yellow-600">{badge.date}</p>
                        ) : (
                          <p className="text-xs text-gray-500">{badge.description}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-center">
                      <Trophy className="mx-auto mb-2 text-purple-600" size={24} />
                      <p className="font-medium text-purple-900 mb-1">Próxima Conquista</p>
                      <p className="text-sm text-purple-700">Faltam apenas 2 competições para desbloquear "Campeão"!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg italic">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                <div className="flex items-center">
                  <Heart className="mr-3 text-red-500" size={20} />
                  <span>Fotos Favoritas</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Button>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                <div className="flex items-center">
                  <Share2 className="mr-3 text-blue-500" size={20} />
                  <span>Compartilhamentos</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Button>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                <div className="flex items-center">
                  <User className="mr-3 text-purple-500" size={20} />
                  <span>Editar Perfil</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNavigationBar />
    </div>
  )
}
