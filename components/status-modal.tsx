"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "success" | "error"
  message: string
}

export function StatusModal({ open, onOpenChange, type, message }: StatusModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          {type === "success" ? (
            <div className="mb-4 rounded-full bg-success/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
          ) : (
            <div className="mb-4 rounded-full bg-destructive/10 p-3">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2">{type === "success" ? "Operación completada" : "Error"}</h3>
          <p className="text-muted-foreground mb-6">{message}</p>
          <Button onClick={() => onOpenChange(false)} className="w-full max-w-xs">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
