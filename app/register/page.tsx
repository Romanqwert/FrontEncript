"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { BanreservasLogo } from "@/components/banreservas-logo"
import { StatusModal } from "@/components/status-modal"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"success" | "error">("success")
  const [modalMessage, setModalMessage] = useState("")
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    correoElectronico: "",
    passwordHash: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.passwordHash !== formData.confirmPassword) {
      setModalType("error")
      setModalMessage("Las contraseñas no coinciden")
      setShowModal(true)
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData
      await api.register(registerData)
      setModalType("success")
      setModalMessage("Tu cuenta ha sido creada correctamente")
      setShowModal(true)
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (error) {
      setModalType("error")
      setModalMessage("Error al registrar usuario")
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
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BanreservasLogo className="h-12 w-12 text-primary" />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-primary">BANRESERVAS</h1>
                <p className="text-xs text-muted-foreground">El Banco de todos los dominicanos</p>
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground" style={{ color: "var(--label-on-light)" }}>REGISTRO DE USUARIO</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-medium" style={{ color: "var(--label-on-light)" }}>
                Nombre completo
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.nombreUsuario}
                onChange={(e) => setFormData({ ...formData, nombreUsuario: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium" style={{ color: "var(--label-on-light)" }}>
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.correoElectronico}
                onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium" style={{ color: "var(--label-on-light)" }}>
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.passwordHash}
                onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium" style={{ color: "var(--label-on-light)" }}>
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Acceder"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>

      <StatusModal open={showModal} onOpenChange={setShowModal} type={modalType} message={modalMessage} />
    </div>
  )
}
