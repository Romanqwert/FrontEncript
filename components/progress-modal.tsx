"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface ProgressModalProps {
  open: boolean
  progress: number
  message?: string
}

export function ProgressModal({ open, progress, message = "Cargando..." }: ProgressModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" hideClose>
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <h3 className="text-xl font-semibold mb-6">{message}</h3>
          <div className="w-full space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-center text-sm text-muted-foreground">{progress}%</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
