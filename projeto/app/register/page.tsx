"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, User, Camera, ScanFace, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useFaceRecognition } from "@/lib/face-recognition-service"

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "consumer",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [facePhoto, setFacePhoto] = useState<File | null>(null)

  const router = useRouter()
  const { registerUserFace } = useFaceRecognition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (formData.userType === "consumer" && !facePhoto) {
      setCurrentStep(2) // Go to face recognition step
    } else {
      // Redirect to login
      router.push("/login")
    }
    setIsLoading(false)
  }

  const handleFacePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFacePhoto(e.target.files[0])
    }
  }

  const completeFaceRegistration = async () => {
    if (!facePhoto) return
    
    setIsLoading(true)
    setError("")
    
    try {
      // Gerar um ID único para o usuário (em produção, viria do backend de autenticação)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Registrar o rosto usando a API Python
      const result = await registerUserFace(userId, facePhoto)
      
      if (result.success) {
        // Salvar o userId no localStorage ou contexto
        localStorage.setItem('userId', userId)
        router.push("/login")
      } else {
        setError("Erro ao processar foto. Tente novamente.")
      }
    } catch (error) {
      console.error('Erro no registro facial:', error)
      setError("Erro ao conectar com o sistema de reconhecimento. Verifique se a API está rodando.")
    } finally {
      setIsLoading(false)
    }
  }

  const skipFaceRegistration = () => {
    router.push("/login")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => setCurrentStep(1)}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="font-bold text-gray-900 italic">Reconhecimento Facial</h1>
            <div className="w-8"></div>
          </div>
        </header>

        <div className="px-4 py-8">
          <div className="max-w-xl mx-auto">
            {/* Face Recognition Setup */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ScanFace size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 italic mb-2">Configure seu Reconhecimento</h2>
              <p className="text-gray-600">
                Adicione uma foto sua para que possamos encontrar você automaticamente nos eventos
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="text-center">
                    {facePhoto ? (
                      <div className="relative">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-500">
                          <img
                            src={URL.createObjectURL(facePhoto) || "/placeholder.svg"}
                            alt="Foto do rosto"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 bg-transparent"
                          onClick={() => setFacePhoto(null)}
                        >
                          Trocar Foto
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                        <ScanFace className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-600 mb-4">Adicione uma foto clara do seu rosto</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFacePhotoUpload}
                          className="hidden"
                          id="facePhoto"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("facePhoto")?.click()}
                          className="border-purple-600 text-purple-600 hover:bg-purple-50"
                        >
                          <Upload className="mr-2" size={16} />
                          Escolher Foto
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Dicas para uma boa foto:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use uma foto recente e clara</li>
                      <li>• Olhe diretamente para a câmera</li>
                      <li>• Evite óculos escuros ou chapéus</li>
                      <li>• Boa iluminação no rosto</li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold"
                      onClick={completeFaceRegistration}
                      disabled={!facePhoto || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processando...</span>
                        </div>
                      ) : (
                        "Finalizar Cadastro"
                      )}
                    </Button>
                    <Button variant="ghost" className="w-full text-gray-600" onClick={skipFaceRegistration}>
                      Pular por agora
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-bold text-gray-900 italic">Cadastrar</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="px-4 py-8">
        <div className="max-w-xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">Midiaz</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 italic">Junte-se à Midiaz!</h2>
            <p className="text-gray-600 mt-2">Crie sua conta e comece a descobrir suas memórias</p>
          </div>

          {/* Registration Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div>
                  <Label className="text-base font-medium">Tipo de Conta</Label>
                  <RadioGroup
                    value={formData.userType}
                    onValueChange={(value) => handleInputChange("userType", value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="consumer" id="consumer" />
                      <Label htmlFor="consumer" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <User className="text-blue-600" size={20} />
                          <div>
                            <p className="font-medium">Consumidor</p>
                            <p className="text-sm text-gray-600">Encontrar e comprar fotos</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="photographer" id="photographer" />
                      <Label htmlFor="photographer" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Camera className="text-purple-600" size={20} />
                          <div>
                            <p className="font-medium">Fotógrafo</p>
                            <p className="text-sm text-gray-600">Vender fotos profissionais</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Seu nome completo"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-xs text-gray-600 text-center">
                Ao criar uma conta, você concorda com nossos{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Política de Privacidade
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
