import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, FileCheck, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">SecureVault</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Comenzar</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Encriptación de Nivel Empresarial
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
            La plataforma completa para almacenamiento seguro de archivos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Protege tus archivos con encriptación de última generación. Sube, gestiona y descarga tus documentos con
            total seguridad y confianza.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                Crear Cuenta Gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-border text-foreground hover:bg-muted bg-transparent"
              >
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-border rounded-lg p-8 bg-card hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-3">Encriptación Segura</h3>
            <p className="text-muted-foreground leading-relaxed">
              Todos tus archivos son encriptados automáticamente antes de ser almacenados en la nube.
            </p>
          </div>

          <div className="border border-border rounded-lg p-8 bg-card hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-3">Gestión Intuitiva</h3>
            <p className="text-muted-foreground leading-relaxed">
              Interfaz moderna y fácil de usar para subir, organizar y descargar tus archivos.
            </p>
          </div>

          <div className="border border-border rounded-lg p-8 bg-card hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-3">Acceso Rápido</h3>
            <p className="text-muted-foreground leading-relaxed">
              Descarga y accede a tus archivos desde cualquier lugar con autenticación JWT.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="border border-border rounded-2xl p-12 bg-card text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4 text-balance">
            Comienza a proteger tus archivos hoy
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que confían en SecureVault para mantener sus archivos seguros.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
              Registrarse Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 SecureVault. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
