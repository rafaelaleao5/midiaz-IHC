"use client"

import { ArrowLeft, Camera, DollarSign, TrendingUp, Users, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar" // Importar a nova barra de navegação
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ParaFotografosPage() {
  const router = useRouter()

  const benefits = [
    {
      icon: DollarSign,
      title: "Monetize suas Fotos",
      description: "Transforme cada evento em uma fonte de renda recorrente",
      highlight: "Até 70% de comissão",
    },
    {
      icon: Zap,
      title: "IA Faz o Trabalho",
      description: "Nossa tecnologia identifica pessoas automaticamente",
      highlight: "Zero trabalho manual",
    },
    {
      icon: TrendingUp,
      title: "Vendas Automáticas",
      description: "Suas fotos vendem 24/7 sem esforço adicional",
      highlight: "Renda passiva",
    },
    {
      icon: Users,
      title: "Alcance Ampliado",
      description: "Conecte-se com milhares de potenciais clientes",
      highlight: "Mercado nacional",
    },
  ]

  const testimonials = [
    {
      name: "João Silva",
      role: "Fotógrafo Esportivo",
      photo: "/placeholder.svg?height=60&width=60&text=João",
      quote: "Triplicou minha renda mensal. A IA da Midiaz é impressionante!",
      earnings: "R$ 8.500/mês",
    },
    {
      name: "Ana Costa",
      role: "Fotógrafa de Eventos",
      photo: "/placeholder.svg?height=60&width=60&text=Ana",
      quote: "Agora posso focar na criação. As vendas acontecem automaticamente.",
      earnings: "R$ 6.200/mês",
    },
    {
      name: "Carlos Lima",
      role: "Fotógrafo Freelancer",
      photo: "/placeholder.svg?height=60&width=60&text=Carlos",
      quote: "Plataforma perfeita para fotógrafos que querem escalar o negócio.",
      earnings: "R$ 4.800/mês",
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: "Cadastre-se",
      description: "Crie sua conta de fotógrafo gratuitamente",
    },
    {
      step: 2,
      title: "Faça Upload",
      description: "Envie suas fotos do evento com informações básicas",
    },
    {
      step: 3,
      title: "IA Processa",
      description: "Nossa tecnologia identifica pessoas e gera tags automaticamente",
    },
    {
      step: 4,
      title: "Receba Pagamentos",
      description: "Ganhe dinheiro toda vez que alguém comprar suas fotos",
    },
  ]

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0 pt-16">
      <Navigation />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 pt-16">
        {" "}
        {/* Added pt-16 for header spacing */}
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-bold text-gray-900 italic">Para Fotógrafos</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Camera size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 italic">
            Transforme sua <span className="text-purple-600">paixão</span> em renda
          </h2>
          <p className="text-gray-600 mb-6">Monetize suas fotos profissionais com nossa plataforma inteligente</p>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">70%</p>
                <p className="text-xs text-gray-600">Comissão para você</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">24/7</p>
                <p className="text-xs text-gray-600">Vendas automáticas</p>
              </div>
            </div>
          </div>

          <Button
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold"
            onClick={() => router.push("/register")}
          >
            Começar a Vender Agora
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6 italic text-center">Por que escolher a Midiaz?</h3>

          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="text-purple-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {benefit.highlight}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6 italic text-center">Fotógrafos que confiam na Midiaz</h3>

          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Image
                      src={testimonial.photo || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="font-medium text-gray-900">{testimonial.name}</p>
                          <p className="text-xs text-gray-600">{testimonial.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-600">{testimonial.earnings}</p>
                          <div className="flex items-center">
                            <Star className="text-yellow-400 fill-current" size={12} />
                            <Star className="text-yellow-400 fill-current" size={12} />
                            <Star className="text-yellow-400 fill-current" size={12} />
                            <Star className="text-yellow-400 fill-current" size={12} />
                            <Star className="text-yellow-400 fill-current" size={12} />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 italic">"{testimonial.quote}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6 italic text-center">Como Funciona</h3>

          <div className="space-y-6">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-purple-200"></div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-8 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h3 className="text-2xl font-bold mb-3 italic">Pronto para aumentar sua renda?</h3>
          <p className="mb-6 text-purple-100">Junte-se a centenas de fotógrafos que já vendem na Midiaz</p>
          <div className="space-y-3">
            <Button
              className="w-full py-3 bg-white text-purple-600 hover:bg-gray-100 font-semibold"
              onClick={() => router.push("/register")}
            >
              Criar Conta de Fotógrafo
            </Button>
            <p className="text-xs text-purple-200">Cadastro gratuito • Sem taxas de setup • Comece a vender hoje</p>
          </div>
        </div>
      </section>
      <BottomNavigationBar />
    </div>
  )
}
