"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, Smartphone, Gift, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar" // Importar a nova barra de navegação
import { useApp } from "@/contexts/AppContext"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { cart, clearCart, user } = useApp()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
  }

  if (cart.length === 0) {
    router.push("/cart")
    return null
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)
  const discount = cart.length >= 3 ? subtotal * 0.1 : 0
  const total = subtotal - discount

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simular processamento
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsComplete(true)
    clearCart()
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4 pb-16 md:pb-0">
        <div className="max-w-xl mx-auto text-center">
          {/* Celebration Animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check size={40} className="text-white" />
            </div>
            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              <div
                className="absolute top-4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-8 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 italic">Parabéns! 🎉</h1>
          <p className="text-gray-600 mb-6">Essas memórias são suas! Suas fotos já estão disponíveis para download.</p>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pedido:</span>
                  <span className="font-medium">#OC-2024-001</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fotos:</span>
                  <span className="font-medium">{cart.length} itens</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total pago:</span>
                  <span className="font-bold text-purple-600">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Thumbnails */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Suas fotos:</p>
            <div className="flex justify-center space-x-2 overflow-x-auto">
              {cart.slice(0, 4).map((item) => (
                <Image
                  key={item.id}
                  src={item.image || "/placeholder.svg"}
                  alt={`Foto ${item.photoId}`}
                  width={60}
                  height={60}
                  className="w-12 h-12 object-cover rounded-lg border-2 border-green-200"
                />
              ))}
              {cart.length > 4 && (
                <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{cart.length - 4}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full py-3 bg-purple-600 hover:bg-purple-700">
              <Sparkles className="mr-2" size={16} />
              Baixar Minhas Fotos
            </Button>
            <Button variant="outline" className="w-full py-3 border-purple-600 text-purple-600 bg-transparent">
              <Gift className="mr-2" size={16} />
              Compartilhar no Instagram
            </Button>
            <Button variant="ghost" className="w-full text-gray-600" onClick={() => router.push("/")}>
              Voltar ao Início
            </Button>
          </div>

          {/* Gamification */}
          <Card className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="font-medium text-yellow-800 mb-1">Nova Conquista Desbloqueada!</p>
              <p className="text-sm text-yellow-700">
                Você ganhou o badge "Colecionador" por comprar {cart.length}+ fotos!
              </p>
            </CardContent>
          </Card>
        </div>
        <BottomNavigationBar />
      </div>
    )
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
          <h1 className="font-bold text-gray-900 italic">Finalizar Compra</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Photo Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={`Foto ${item.photoId}`}
                      width={60}
                      height={60}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cart.length} {cart.length === 1 ? "foto" : "fotos"}):
                  </span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto (3+ fotos):</span>
                    <span>-R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-purple-600">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="text-green-600" size={20} />
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-gray-600">Aprovação instantânea</p>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="text-blue-600" size={20} />
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, Elo</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* PIX Details */}
              {paymentMethod === "pix" && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center border">
                      <div className="text-xs text-gray-500">QR Code PIX</div>
                    </div>
                    <p className="text-sm text-green-800 mb-2">Escaneie o QR Code ou copie a chave PIX</p>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 bg-transparent">
                      Copiar Chave PIX
                    </Button>
                  </div>
                </div>
              )}

              {/* Card Details */}
              {paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Validade</Label>
                      <Input id="expiry" placeholder="MM/AA" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input id="cardName" placeholder="Seu nome completo" className="mt-1" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg italic">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={user.email} disabled className="mt-1 bg-gray-50" />
              </div>
              <div>
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input id="phone" placeholder="(11) 99999-9999" className="mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="text-xs text-gray-600 text-center">
            Ao finalizar a compra, você concorda com nossos{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Política de Privacidade
            </a>
          </div>

          {/* Payment Button */}
          <Button
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 font-semibold text-lg"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processando...</span>
              </div>
            ) : (
              `Pagar R$ ${total.toFixed(2)}`
            )}
          </Button>
        </div>
      </div>
      <BottomNavigationBar />
    </div>
  )
}
