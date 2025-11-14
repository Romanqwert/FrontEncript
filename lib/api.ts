import type { HistorialInfo } from "@/components/history-data-table";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7297";

export interface LoginCredentials {
  correoElectronico: string;
  passwordHash: string;
}

export interface RegisterData {
  nombreUsuario: string;
  correoElectronico: string;
  passwordHash: string;
}

export interface UserProfile {
  idUsuario: number;
  nombreUsuario: string;
  correoElectronico: string;
  fechaRegistro: string;
}

export interface ArchivoInfo {
  idArchivo: number;
  nombreArchivo: string;
  tipoMime: string;
  tamanoBytes: number;
  fechaSubida: string;
}

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Error al registrar usuario");
    }

    return response.json();
  }

  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Credenciales inválidas");
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  }

  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/perfil`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener perfil");
    }

    return response.json();
  }

  async uploadFile(
    file: File,
    encryptTargets: string[] | null = null,
    encryptionPassword = ""
  ) {
    const formData = new FormData();
    formData.append("file", file);

    if (encryptTargets && encryptTargets.length > 0) {
      // Send each encrypt target as a separate form data item
      encryptTargets.forEach((target) => {
        formData.append("EncryptTargets", target);
      });
    }

    formData.append("EncryptionKey", encryptionPassword);

    // Opción 3: Versión más legible para archivos
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: File(name: ${value.name}, size: ${value.size}, type: ${value.type})`
        );
      } else {
        console.log(`${key}:`, value);
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/Archivos/upload`, {
      method: "POST",
      headers: this.getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Error al subir archivo");
    }

    return response.json();
  }

  async listHistory(): Promise<HistorialInfo[]> {
    const response = await fetch(`${API_BASE_URL}/api/Archivos/history`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Error al listar archivos");
    }

    return response.json();
  }

  async listFilesForDownload(): Promise<ArchivoInfo[]> {
    const response = await fetch(`${API_BASE_URL}/api/Archivos/list/download`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Error al listar archivos para descargar");
    }

    return response.json();
  }

  async downloadFileOriginal(id: number, fileName: string, password = "") {
    console.log("Descargando archivo...");

    // Construir URL con el password como query parameter
    const url = password
      ? `${API_BASE_URL}/api/Archivos/download/${id}?encryptionKey=${encodeURIComponent(
          password
        )}`
      : `${API_BASE_URL}/api/Archivos/download/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Error al descargar archivo");
    }

    const blob = await response.blob();
    const url_download = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url_download;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url_download);
    document.body.removeChild(a);
  }

  async downloadFile(id: number, fileName: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/Archivos/download/unencrypted/${id}`,
      {
        headers: this.getAuthHeader(),
      }
    );

    if (!response.ok) {
      throw new Error("Error al descargar archivo");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async deleteFile(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/Archivos/delete/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Error al eliminar archivo");
    }

    return response.json();
  }

  logout() {
    localStorage.removeItem("token");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }
}

export const api = new ApiClient();
