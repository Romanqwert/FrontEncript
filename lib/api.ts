const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7297/api"

export interface LoginCredentials {
  correoElectronico: string
  passwordHash: string
}

export interface RegisterData {
  nombreUsuario: string
  correoElectronico: string
  passwordHash: string
}

export interface UserProfile {
  idUsuario: number
  nombreUsuario: string
  correoElectronico: string
  fechaRegistro: string
}

export interface ArchivoInfo {
  idArchivo: number
  nombreArchivo: string
  tipoMime: string
  tamanoBytes: number
  fechaSubida: string
}

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async register(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Error al registrar usuario")
    }

    return response.json()
  }

  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Credenciales inválidas")
    }

    const data = await response.json()
    if (data.token) {
      localStorage.setItem("token", data.token)
    }
    return data
  }

  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/perfil`, {
      headers: this.getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Error al obtener perfil")
    }

    return response.json()
  }

  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/api/Archivos/upload`, {
      method: "POST",
      headers: this.getAuthHeader(),
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Error al subir archivo")
    }

    return response.json()
  }

  async listFiles(): Promise<ArchivoInfo[]> {
    const response = await fetch(`${API_BASE_URL}/api/Archivos/list`, {
      headers: this.getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Error al listar archivos")
    }

    return response.json()
  }

  async listFilesForDownload(): Promise<ArchivoInfo[]> {
    const response = await fetch(`${API_BASE_URL}/api/Archivos/list/download`, {
      headers: this.getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Error al listar archivos para descargar")
    }

    return response.json()
  }

  async downloadFile(id: number, fileName: string) {
    const response = await fetch(`${API_BASE_URL}/api/Archivos/download/${id}`, {
      headers: this.getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Error al descargar archivo")
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  logout() {
    localStorage.removeItem("token")
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
  }
}

export const api = new ApiClient()
