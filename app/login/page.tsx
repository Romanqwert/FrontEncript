"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { api } from "@/lib/api"
import { BanreservasLogo } from "@/components/banreservas-logo"
import { StatusModal } from "@/components/status-modal"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"success" | "error">("success")
  const [modalMessage, setModalMessage] = useState("")
  const [formData, setFormData] = useState({
    correoElectronico: "",
    passwordHash: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.login(formData)
      setModalType("success")
      setModalMessage("Esta operación ha sido completada.")
      setShowModal(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      setModalType("error")
      setModalMessage("Esta operación no se pudo completar.")
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/modern-city-skyline-at-dusk.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <BanreservasLogo className="h-12 w-12 text-primary" />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-primary">BANRESERVAS</h1>
                <p className="text-xs text-muted-foreground">El Banco de todos los dominicanos</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium" style={{ color: "var(--label-on-light)" }}>
                Usuario o correo
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingrese su usuario"
                value={formData.correoElectronico}
                onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium" style={{ color: "var(--label-on-light)" }}>
                Ingrese su contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={formData.passwordHash}
                  onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                  required
                  className="bg-input border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center justify-end">
                <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                  Olvidé mi contraseña
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              disabled={loading}
            >
              {loading ? "Accediendo..." : "Acceder"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">¿No tienes una cuenta? </span>
            <Link href="/register" className="text-primary hover:underline font-medium">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>

      <StatusModal open={showModal} onOpenChange={setShowModal} type={modalType} message={modalMessage} />
    </div>
  )
}
