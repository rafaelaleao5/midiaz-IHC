"use client"

import { ArrowLeft, ScanFace, Search, ShoppingCart, Download, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"
import { BottomNavigationBar } from "@/components/BottomNavigationBar" // Importar a nova barra de navegação
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ComoFuncionaPage() {
  const router = useRouter()

  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Busque o Evento",
      description: "Procure pelo evento que você participou usando nosso sistema de busca inteligente.",
      image: "/placeholder.svg?height=200&width=300&text=Search",
    },
    {
      id: 2,
      icon: ScanFace,
      title: "IA Encontra Você",
      description: "Nossa inteligência artificial reconhece automaticamente seu rosto nas fotos do evento.",
      image: "/placeholder.svg?height=200&width=300&text=AI",
    },
    {
      id: 3,
      icon: ShoppingCart,
      title: "Escolha e Compre",
      description: "Selecione suas fotos favoritas e finalize a compra de forma rápida e segura.",
      image: "/placeholder.svg?height=200&width=300&text=Cart",
    },
    {
      id: 4,
      icon: Download,
      title: "Download Imediato",
      description: "Após o pagamento, baixe suas fotos em alta qualidade instantaneamente.",
      image: "/placeholder.svg?height=200&width=300&text=Download",
    },
  ]

  const faqs = [
    {
      question: "Como a IA reconhece meu rosto?",
      answer:
        "Utilizamos tecnologia avançada de reconhecimento facial que analisa características únicas do seu rosto para identificá-lo nas fotos dos eventos.",
    },
    {
      question: "Minhas fotos ficam armazenadas na plataforma?",
      answer:
        "Não, suas fotos são suas! Após a compra, você pode baixá-las e elas ficam disponíveis na sua conta por tempo ilimitado.",
    },
    {
      question: "E se eu não gostar das fotos encontradas?",
      answer:
        "Você só paga pelas fotos que escolher. Pode visualizar todas as fotos encontradas antes de decidir quais comprar.",
    },
    {
      question: "Como funciona o pagamento?",
      answer:
        "Aceitamos PIX (aprovação instantânea) e cartões de crédito. O pagamento é 100% seguro e você recebe as fotos imediatamente.",
    },
    {
      question: "Posso usar as fotos comercialmente?",
      answer:
        "As fotos são para uso pessoal. Para uso comercial, entre em contato diretamente com o fotógrafo através da nossa plataforma.",
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
          <h1 className="font-bold text-gray-900 italic">Como Funciona</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Play size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 italic">
            É simples encontrar suas <span className="text-purple-600">memórias</span>
          </h2>
          <p className="text-gray-600 mb-6">Em apenas 4 passos você encontra e compra suas fotos profissionais</p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6 italic text-center">Passo a Passo</h3>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.id} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-16 bg-purple-200"></div>}

                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="flex-shrink-0 w-12 bg-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{step.id}</span>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Icon className="text-purple-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                              <Image
                                src={step.image || "/placeholder.svg"}
                                alt={step.title}
                                width={200}
                                height={120}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6 italic text-center">Perguntas Frequentes</h3>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4 italic">Pronto para começar?</h3>
          <p className="text-gray-600 mb-6">Encontre suas fotos em segundos</p>
          <div className="space-y-3">
            <Button
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold"
              onClick={() => router.push("/register")}
            >
              Criar Conta Grátis
            </Button>
            <Button
              variant="outline"
              className="w-full py-3 border-purple-600 text-purple-600 bg-transparent"
              onClick={() => router.push("/search")}
            >
              Buscar Eventos
            </Button>
          </div>
        </div>
      </section>
      <BottomNavigationBar />
    </div>
  )
}
