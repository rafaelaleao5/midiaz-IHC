"use client"

import { Home, Search, ShoppingCart, Camera, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/AppContext"
import { usePathname, useRouter } from "next/navigation"

export function BottomNavigationBar() {
  const { cart } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Buscar", icon: Search, path: "/search" },
    { name: "Carrinho", icon: ShoppingCart, path: "/cart", badge: cart.length > 0 ? cart.length : undefined },
    { name: "Fotógrafos", icon: Camera, path: "/para-fotografos" },
    { name: "Menu", icon: Menu, path: "/opcoes" }, // redirecionamento direto
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <nav className="flex justify-around h-16 items-center">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center text-xs font-medium px-2 py-1 rounded-md transition-colors relative
              ${pathname === item.path ? "text-purple-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            {item.badge && (
              <Badge className="absolute -top-1 right-0 bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full p-0 flex items-center justify-center">
                {item.badge}
              </Badge>
            )}
            <item.icon size={20} className="mb-1" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
