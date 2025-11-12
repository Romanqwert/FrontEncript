"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"

interface PasswordModalProps {
  open: boolean
  title: string
  description?: string
  onConfirm: (password: string) => void
  onCancel: () => void
  isLoading?: boolean
}

export function PasswordModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
}: PasswordModalProps) {
  const [password, setPassword] = useState("")

  const handleConfirm = () => {
    if (password.trim()) {
      onConfirm(password)
      setPassword("")
    }
  }

  const handleCancel = () => {
    setPassword("")
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-5 w-5 text-primary" />
            <DialogTitle>{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingrese la contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && password.trim()) {
                  handleConfirm()
                }
              }}
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!password.trim() || isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
