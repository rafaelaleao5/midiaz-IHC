"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useApp()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (!success) {
        setError("Email ou senha incorretos")
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-bold text-gray-900 italic">Entrar</h1>
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
            <h2 className="text-2xl font-bold text-gray-900 italic">Bem-vindo de volta!</h2>
            <p className="text-gray-600 mt-2">Entre na sua conta para continuar</p>
          </div>

          {/* Demo Accounts */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-900">Contas de Demonstração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-blue-800">
                <p>
                  <strong>Consumidor:</strong> qualquer@email.com / senha123
                </p>
                <p>
                  <strong>Fotógrafo:</strong> fotografo@midiaz.com / senha123
                </p>
                <p>
                  <strong>Admin:</strong> admin@midiaz.com / senha123
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Login Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
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
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                  Esqueceu sua senha?
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
