"use client"

import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar" // Importar a nova barra de navegação
import { useApp } from "@/contexts/AppContext"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, removeFromCart, user } = useApp()
  const router = useRouter()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-16 md:pb-0">
        <Navigation />
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 pt-16">
          {" "}
          {/* Added pt-16 for header spacing */}
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="font-bold text-gray-900 italic">Carrinho</h1>
            <div className="w-8"></div>
          </div>
        </header>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🛒</span>
            </div>
            <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/search")}>
              Buscar Fotos
            </Button>
          </div>
        </div>
        <BottomNavigationBar />
      </div>
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)
  const discount = cart.length >= 3 ? subtotal * 0.1 : 0
  const total = subtotal - discount

  const handleCheckout = () => {
    if (!user) {
      router.push("/login")
      return
    }
    router.push("/checkout")
  }

  const handleContinueShopping = () => {
    if (!cart.length) {
      router.push("/search")
      return
    }
    const last = cart[cart.length - 1]
    router.push(`/event/${last.eventId}`)
  }


  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navigation />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 pt-16">
        {" "}
        {/* Added pt-16 for header spacing */}
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-bold text-gray-900 italic">Carrinho ({cart.length})</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Cart Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Suas Fotos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={`Foto ${item.photoId}`}
                      width={80}
                      height={80}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Foto #{item.photoId.split("-")[1]}</p>
                    <p className="text-sm text-gray-600">{item.eventName}</p>
                    <p className="text-sm font-medium text-purple-600">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cart.length} {cart.length === 1 ? "foto" : "fotos"}):
                  </span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto (3+ fotos - 10%):</span>
                    <span>-R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-purple-600">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Discount Info */}
              {cart.length >= 3 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-medium">🎉 Desconto aplicado!</p>
                  <p className="text-xs text-green-700">Você economizou R$ {discount.toFixed(2)} comprando 3+ fotos</p>
                </div>
              )}

              {cart.length < 3 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">💡 Dica de economia</p>
                  <p className="text-xs text-blue-700">
                    Adicione mais {3 - cart.length} foto{3 - cart.length === 1 ? "" : "s"} e ganhe 10% de desconto!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold text-lg"
              onClick={handleCheckout}
            >
              {!user ? "Fazer Login e Finalizar" : "Finalizar Compra"}
            </Button>
            <Button
              variant="outline"
              className="w-full py-3 border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
              onClick={handleContinueShopping}
            >
              Continuar Comprando
            </Button>
          </div>

          {/* Security Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500">🔒 Compra 100% segura • Download imediato após pagamento</p>
          </div>
        </div>
      </div>
      <BottomNavigationBar />
    </div>
  )
}
