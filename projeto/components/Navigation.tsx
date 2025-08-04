"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/AppContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkBackground, setIsDarkBackground] = useState(true)
  const { user, cart, logout } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  // Detectar se estamos em uma página com fundo escuro
  useEffect(() => {
    const checkBackground = () => {
      // Páginas com fundo escuro (roxo)
      const darkPages = ['/', '/search', '/event']
      const isDarkPage = darkPages.some(page => pathname.startsWith(page))
      setIsDarkBackground(isDarkPage)
    }

    checkBackground()
  }, [pathname])

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  // Classes condicionais baseadas no fundo
  const textColor = isDarkBackground ? 'text-white' : 'text-gray-900'
  const textHoverColor = isDarkBackground ? 'hover:text-white' : 'hover:text-purple-600'
  const textOpacity = isDarkBackground ? 'text-white/90' : 'text-gray-700'
  const buttonBorder = isDarkBackground ? 'border-white/30' : 'border-gray-300'
  const buttonHover = isDarkBackground ? 'hover:bg-white/10' : 'hover:bg-gray-100'
  const buttonGhostHover = isDarkBackground ? 'hover:bg-white/10' : 'hover:bg-gray-100'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo e Links de Navegação */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MZ</span>
              </div>
              <span className="text-xl font-bold text-gray-900 italic">Midiaz</span>
            </Link>

            {/* Links de Navegação - Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => handleNavigation("/search")}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Buscar fotos
              </button>
              <button
                onClick={() => handleNavigation("/para-fotografos")}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Vender fotos
              </button>
              <button
                onClick={() => handleNavigation("/como-funciona")}
                className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                <span>Como funciona</span>
              </button>
            </div>
          </div>

          {/* Ações do Usuário */}
          <div className="flex items-center space-x-3">
            {/* Carrinho (Desktop & Mobile) */}
            {user && cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 relative text-gray-700 hover:bg-gray-100"
                onClick={() => handleNavigation("/cart")}
              >
                <ShoppingCart size={20} />
                <Badge className="absolute -top-1 -right-1 bg-purple-600 hover:bg-purple-700 text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                  {cart.length}
                </Badge>
              </Button>
            )}

            {/* Mobile Header Login/Profile (visible only on mobile) */}
            <div className="md:hidden flex items-center space-x-2">
              {user ? (
                <button
                  onClick={() => handleNavigation("/account")}
                  className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-purple-600 text-white text-sm font-semibold"
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigation("/login")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent px-3 py-1.5 h-auto text-xs"
                  >
                    Entrar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 h-auto text-xs"
                    onClick={() => handleNavigation("/register")}
                  >
                    Criar conta
                  </Button>
                </>
              )}
            </div>

            {/* Desktop User Actions (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 text-sm">Olá, {user.name.split(" ")[0]}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
                  >
                    Sair
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => handleNavigation("/account")}
                  >
                    <User size={20} />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigation("/login")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
                  >
                    Entrar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleNavigation("/register")}
                  >
                    Criar conta
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
