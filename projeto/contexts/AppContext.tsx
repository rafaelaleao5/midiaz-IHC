"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth-service"

interface CartItem {
  id: string
  photoId: string
  eventId: string
  eventName: string
  price: number
  image: string
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  type: "consumer" | "photographer" | "admin"
}

interface Event {
  id: string
  name: string
  location: string
  date: string
  photographer: string
  totalPhotos: number
  views: number
  sales: number
  image: string
  category: string
}

interface Photo {
  id: string
  eventId: string
  image: string
  price: number
  likes: number
  views: number
  hasUser?: boolean
  confidence?: number
  number?: number
  tags?: string[]
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "id">) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  events: Event[]
  photos: Photo[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedEvent: Event | null
  setSelectedEvent: (event: Event | null) => void
  foundPhotos: Photo[]
  setFoundPhotos: (photos: Photo[]) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  showToast: (message: string, type?: "success" | "error" | "info") => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Expanded real event photos from Unsplash
const eventPhotos = [
  "https://imagens.ebc.com.br/BmMgwvUS3xdQXpi8AmDYqSMvwXM=/1170x700/smart/https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/2024/06/03/53765510026_f6f4aa2e4f_o.jpg?itok=Y7QzLiNH", // Football
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop", // Basketball
  "https://str1.lnmimg.com/img/2023/11/11/fe52f5ce46d478b0e9d9d5a337f9ae8a.jpeg", // Running
  "https://www.lajedo.com.br/wp-content/uploads/2024/02/como-organizar-uma-festa-do-ensino-medio-lajedo-rj.jpg", // Graduation
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=200&fit=crop", // Concert
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop", // Wedding
  "https://univassouras.edu.br/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-05-at-17.34.36-768x1024.jpeg", // Conference
  "https://s2-ge.glbimg.com/-JP3sXeHQkuSN2P_nlcG_M6xTYs=/0x0:3394x2356/924x0/smart/filters:strip_icc()/s.glbimg.com/es/ge/f/original/2019/04/15/2019-04-15t161825z_1964922355_nocid_rtrmadp_3_running-boston-marathon.jpg", // Marathon
  "https://s1.static.brasilescola.uol.com.br/be/2024/04/jogadoras-tenis.jpg", // Tennis
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTWKDs5rzyKx-iw0dacFQvbltTJ4Bt9g6PQQ&s", // Swimming
  "https://navegantes.sc.gov.br/wp-content/uploads/2025/01/Circuito-Brasileiro-de-Volei-de-Praia-Credito-da-foto-Mauricio-Val-FV-Imagem-CBV-4.jpg", // Volleyball
  "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400&h=200&fit=crop", // Soccer
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop", // Mountain event
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop", // Beach event
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=200&fit=crop", // Music festival
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=200&fit=crop", // Party
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=200&fit=crop", // Corporate
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=200&fit=crop", // Art exhibition
  "https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/11/masterchef-2024.png?w=1200&h=900&crop=0", // Food festival
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=200&fit=crop", // Fashion show
]

// Expanded gallery photos
const galleryPhotos = [
  "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1546608235-3c4f0b2b4c3e?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
]

// Much expanded mock events with real photos
const mockEvents: Event[] = [
  {
    id: "1",
    name: "Copa Universitária 2024",
    location: "Estádio Municipal - São Paulo",
    date: "15 de Dezembro, 2024",
    photographer: "João Silva Photography",
    totalPhotos: 1250,
    views: 15420,
    sales: 89,
    image: eventPhotos[0],
    category: "Esportivo",
  },
  {
    id: "2",
    name: "Formatura Medicina UFMG",
    location: "Centro de Convenções - Belo Horizonte",
    date: "12 de Dezembro, 2024",
    photographer: "Ana Costa Fotografia",
    totalPhotos: 890,
    views: 8930,
    sales: 67,
    image: eventPhotos[3],
    category: "Acadêmico",
  },
  {
    id: "3",
    name: "Festival de Música Indie",
    location: "Parque da Cidade - Brasília",
    date: "10 de Dezembro, 2024",
    photographer: "Carlos Lima Studio",
    totalPhotos: 2100,
    views: 12180,
    sales: 45,
    image: eventPhotos[4],
    category: "Cultural",
  },
  {
    id: "4",
    name: "Maratona Internacional SP",
    location: "Ibirapuera - São Paulo",
    date: "8 de Dezembro, 2024",
    photographer: "Pedro Santos Foto",
    totalPhotos: 3200,
    views: 25600,
    sales: 156,
    image: eventPhotos[7],
    category: "Esportivo",
  },
  {
    id: "5",
    name: "Casamento Marina & Rafael",
    location: "Fazenda Vista Alegre - Campinas",
    date: "7 de Dezembro, 2024",
    photographer: "Lucia Fernandes Studio",
    totalPhotos: 650,
    views: 4200,
    sales: 89,
    image: eventPhotos[5],
    category: "Social",
  },
  {
    id: "6",
    name: "Conferência Tech Brasil 2024",
    location: "Centro de Convenções - Rio de Janeiro",
    date: "5 de Dezembro, 2024",
    photographer: "Miguel Torres Photo",
    totalPhotos: 1100,
    views: 8900,
    sales: 67,
    image: eventPhotos[6],
    category: "Corporativo",
  },
  {
    id: "7",
    name: "Campeonato Estadual de Tênis",
    location: "Clube Paineiras - São Paulo",
    date: "3 de Dezembro, 2024",
    photographer: "Roberto Silva Fotografia",
    totalPhotos: 980,
    views: 6700,
    sales: 45,
    image: eventPhotos[8],
    category: "Esportivo",
  },
  {
    id: "8",
    name: "Festival Gastronômico",
    location: "Mercado Municipal - São Paulo",
    date: "1 de Dezembro, 2024",
    photographer: "Carla Mendes Photo",
    totalPhotos: 750,
    views: 5400,
    sales: 34,
    image: eventPhotos[18],
    category: "Cultural",
  },
  {
    id: "9",
    name: "Formatura Engenharia USP",
    location: "Auditório da USP - São Paulo",
    date: "28 de Novembro, 2024",
    photographer: "Fernando Costa Studio",
    totalPhotos: 1200,
    views: 9800,
    sales: 78,
    image: eventPhotos[3],
    category: "Acadêmico",
  },
  {
    id: "10",
    name: "Show Rock Nacional",
    location: "Espaço das Américas - São Paulo",
    date: "25 de Novembro, 2024",
    photographer: "Beatriz Lima Foto",
    totalPhotos: 1800,
    views: 14200,
    sales: 92,
    image: eventPhotos[4],
    category: "Cultural",
  },
  {
    id: "11",
    name: "Campeonato de Natação",
    location: "Centro Aquático - Rio de Janeiro",
    date: "22 de Novembro, 2024",
    photographer: "André Oliveira Photo",
    totalPhotos: 1400,
    views: 8600,
    sales: 56,
    image: eventPhotos[9],
    category: "Esportivo",
  },
  {
    id: "12",
    name: "Feira de Arte Contemporânea",
    location: "Pavilhão da Bienal - São Paulo",
    date: "20 de Novembro, 2024",
    photographer: "Juliana Rocha Studio",
    totalPhotos: 900,
    views: 6200,
    sales: 41,
    image: eventPhotos[17],
    category: "Cultural",
  },
  {
    id: "13",
    name: "Torneio de Vôlei de Praia",
    location: "Copacabana - Rio de Janeiro",
    date: "18 de Novembro, 2024",
    photographer: "Ricardo Alves Foto",
    totalPhotos: 1100,
    views: 7800,
    sales: 63,
    image: eventPhotos[10],
    category: "Esportivo",
  },
  {
    id: "14",
    name: "Congresso de Medicina",
    location: "Hotel Maksoud - São Paulo",
    date: "15 de Novembro, 2024",
    photographer: "Patricia Santos Photo",
    totalPhotos: 800,
    views: 5600,
    sales: 38,
    image: eventPhotos[6],
    category: "Corporativo",
  },
  {
    id: "15",
    name: "Festival de Inverno",
    location: "Campos do Jordão - São Paulo",
    date: "12 de Novembro, 2024",
    photographer: "Gabriel Martins Studio",
    totalPhotos: 1600,
    views: 11400,
    sales: 84,
    image: eventPhotos[12],
    category: "Cultural",
  },
  {
    id: "16",
    name: "Casamento Ana & Pedro",
    location: "Igreja do Rosário - Ouro Preto",
    date: "10 de Novembro, 2024",
    photographer: "Mariana Silva Foto",
    totalPhotos: 720,
    views: 4800,
    sales: 67,
    image: eventPhotos[5],
    category: "Social",
  },
  {
    id: "17",
    name: "Desfile de Moda Verão",
    location: "Fashion Week - São Paulo",
    date: "8 de Novembro, 2024",
    photographer: "Rodrigo Pereira Photo",
    totalPhotos: 950,
    views: 8200,
    sales: 72,
    image: eventPhotos[19],
    category: "Cultural",
  },
  {
    id: "18",
    name: "Corrida Noturna SP",
    location: "Parque Villa-Lobos - São Paulo",
    date: "5 de Novembro, 2024",
    photographer: "Camila Rodrigues Studio",
    totalPhotos: 2200,
    views: 16800,
    sales: 134,
    image: eventPhotos[2],
    category: "Esportivo",
  },
  {
    id: "19",
    name: "Festa de 15 Anos Isabella",
    location: "Buffet Espaço Gardens - São Paulo",
    date: "3 de Novembro, 2024",
    photographer: "Thiago Almeida Foto",
    totalPhotos: 580,
    views: 3400,
    sales: 45,
    image: eventPhotos[15],
    category: "Social",
  },
  {
    id: "20",
    name: "Seminário de Tecnologia",
    location: "Campus Google - São Paulo",
    date: "1 de Novembro, 2024",
    photographer: "Larissa Costa Photo",
    totalPhotos: 650,
    views: 4600,
    sales: 32,
    image: eventPhotos[16],
    category: "Corporativo",
  },
]

const generateMockPhotos = (): Photo[] => {
  const photos: Photo[] = []
  mockEvents.forEach((event, eventIndex) => {
    for (let i = 1; i <= Math.min(event.totalPhotos, 50); i++) {
      const photoIndex = (eventIndex * 50 + i - 1) % galleryPhotos.length
      photos.push({
        id: `${event.id}-${i}`,
        eventId: event.id,
        image: galleryPhotos[photoIndex],
        price: 15 + Math.floor(Math.random() * 10),
        likes: Math.floor(Math.random() * 100) + 5,
        views: Math.floor(Math.random() * 500) + 50,
        hasUser: Math.random() > 0.7,
        confidence: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 80 : undefined,
        number: Math.random() > 0.8 ? Math.floor(Math.random() * 99) + 1 : undefined,
        tags: ["Esporte", "Ação", "Momento", "Emoção"].slice(0, Math.floor(Math.random() * 4) + 1),
      })
    }
  })
  return photos
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [events] = useState<Event[]>(mockEvents)
  const [photos] = useState<Photo[]>(generateMockPhotos())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [foundPhotos, setFoundPhotos] = useState<Photo[]>([])
  const [toastMessage, setToastMessage] = useState<string>("")
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info")

  const router = useRouter()

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      }
    }

    checkAuth()
  }, [])

  const addToCart = (item: Omit<CartItem, "id">) => {
    const newItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random()}`,
    }
    setCart((prev) => [...prev, newItem])
    showToast("Foto adicionada ao carrinho!", "success")
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
    showToast("Foto removida do carrinho", "info")
  }

  const clearCart = () => {
    setCart([])
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock login logic
    if (email === "admin@midiaz.com") {
      setUser({
        id: "admin-1",
        name: "Admin Midiaz",
        email: "admin@midiaz.com",
        avatar: "/placeholder.svg?height=80&width=80",
        type: "admin",
      })
      router.push("/admin/dashboard")
      return true
    } else if (email === "fotografo@midiaz.com") {
      setUser({
        id: "photographer-1",
        name: "João Silva",
        email: "fotografo@midiaz.com",
        avatar: "/placeholder.svg?height=80&width=80",
        type: "photographer",
      })
      router.push("/photographer/dashboard")
      return true
    } else if (email && password) {
      setUser({
        id: "user-1",
        name: "Maria Silva",
        email: email,
        avatar: "/placeholder.svg?height=80&width=80",
        type: "consumer",
      })
      router.push("/")
      return true
    }
    return false
  }


  const logout = () => {
    AuthService.logout()
    setUser(null)
    clearCart()
    router.push("/")
    showToast("Logout realizado com sucesso", "success")
  }

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToastMessage(message)
    setToastType(type)
    // Auto-hide toast after 3 seconds
    setTimeout(() => setToastMessage(""), 3000)
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        events,
        photos,
        searchQuery,
        setSearchQuery,
        selectedEvent,
        setSelectedEvent,
        foundPhotos,
        setFoundPhotos,
        login,
        logout,
        showToast,
      }}
    >
      {children}
      {/* Simple Toast */}
      {toastMessage && (
        <div
          className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
            toastType === "success" ? "bg-green-600" : toastType === "error" ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          {toastMessage}
        </div>
      )}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
