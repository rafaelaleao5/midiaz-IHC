"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Home, Search, ShoppingCart, Camera, Menu } from "lucide-react"
import { BottomNavigationBar } from "@/components/BottomNavigationBar"
import Image from "next/image"

const options = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Buscar", path: "/search" },
  { icon: ShoppingCart, label: "Carrinho", path: "/cart" },
  { icon: Camera, label: "Fotógrafos", path: "/para-fotografos" },
  { icon: Menu, label: "Como Funciona", path: "/como-funciona" },
]

export default function OpcoesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="pt-10 px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OC</span>
            </div>
            <span className="text-xl font-bold text-gray-800 italic">OnClick</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => router.push("/login")}>
            Entrar
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => router.push("/register")}>
            Criar conta
          </Button>
        </div>
      </header>

      {/* Lista de Opções */}
      <section className="mt-8 px-4">
        <ul className="space-y-4">
          {options.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(item.path)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="text-purple-600" size={20} />
                <span className="text-gray-800 font-medium">{item.label}</span>
              </div>
              <span className="text-gray-400">›</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Barra de navegação inferior */}
      <BottomNavigationBar />
    </div>
  )
}
