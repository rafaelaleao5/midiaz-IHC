"use client"

import { useState, useCallback } from "react"
import { 
  Settings, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Edit,
  Save,
  X,
  Home,
  Calendar,
  LogOut,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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

export default function PhotographerProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    location: "São Paulo, SP",
    bio: "Fotógrafo profissional com mais de 5 anos de experiência em eventos esportivos e corporativos. Especializado em capturar momentos únicos e emocionantes.",
    specialties: ["Eventos Esportivos", "Casamentos", "Corporativo", "Retratos"],
    experience: "5+ anos",
    eventsCount: 45,
    photosCount: 2500,
    rating: 4.8
  })

  const handleTabChange = useCallback((tab: string) => {
    if (tab === "dashboard") {
      router.push("/photographer/dashboard")
    } else if (tab === "events") {
      router.push("/photographer/events")
    } else if (tab === "photos") {
      router.push("/photographer/photos")
    } else {
      setActiveTab(tab)
    }
  }, [router])

  const handleSave = () => {
    setIsEditing(false)
    // Aqui você implementaria a lógica para salvar as alterações
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Aqui você implementaria a lógica para cancelar as alterações
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
                <h1 className="text-xl font-bold text-gray-900 italic">Perfil</h1>
                <p className="text-sm text-gray-600">Gerencie suas informações pessoais e profissionais</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="text-lg font-semibold"
                      />
                    ) : (
                      <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
                    )}
                    <p className="text-sm text-gray-500">Fotógrafo Profissional</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center text-gray-700">
                        <Mail className="w-4 h-4 mr-2" />
                        {profile.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-4 h-4 mr-2" />
                        {profile.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-2" />
                        {profile.location}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiência</Label>
                    {isEditing ? (
                      <Input
                        id="experience"
                        value={profile.experience}
                        onChange={(e) => setProfile({...profile, experience: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center text-gray-700">
                        <Camera className="w-4 h-4 mr-2" />
                        {profile.experience}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700">{profile.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Especialidades */}
            <Card>
              <CardHeader>
                <CardTitle>Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{profile.eventsCount}</div>
                  <p className="text-gray-600">Eventos Participados</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{profile.photosCount}</div>
                  <p className="text-gray-600">Fotos Enviadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{profile.rating}</div>
                  <p className="text-gray-600">Avaliação Média</p>
                </CardContent>
              </Card>
            </div>

            {/* Configurações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificações por Email</h3>
                    <p className="text-sm text-gray-500">Receber notificações sobre novos eventos</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Privacidade</h3>
                    <p className="text-sm text-gray-500">Gerenciar visibilidade do perfil</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Alterar Senha</h3>
                    <p className="text-sm text-gray-500">Atualizar sua senha de acesso</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Alterar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 