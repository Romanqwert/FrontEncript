export const TABS = {
  ENCRYPT: "encrypt",
  DECRYPT: "decrypt",
  HISTORY: "history",
  PROFILE: "profile",
} as const;

export type TabType = (typeof TABS)[keyof typeof TABS];

export const MODAL_MESSAGES = {
  UPLOAD_SUCCESS: "Archivo encriptado y subido correctamente",
  UPLOAD_ERROR: "Error al subir archivo",
  DOWNLOAD_SUCCESS: "Archivo descargado y desencriptado correctamente",
  DOWNLOAD_ERROR: "Error al descargar archivo",
  LOAD_HISTORY_ERROR: "Error al cargar archivos",
  LOAD_FILES_ERROR: "Error al cargar archivos para descargar",
  LOAD_PROFILE_ERROR: "Error loading profile",
} as const;

export const MODAL_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const PASSWORD_MODAL_TYPES = {
  UPLOAD: "upload",
  DOWNLOAD: "download",
} as const;

export const PASSWORD_MODAL_CONFIG = {
  [PASSWORD_MODAL_TYPES.UPLOAD]: {
    title: "Contraseña de Encriptación",
    description: "Ingrese una contraseña para encriptar el archivo",
  },
  [PASSWORD_MODAL_TYPES.DOWNLOAD]: {
    title: "Contraseña de Desencriptación",
    description: "Ingrese la contraseña para desencriptar el archivo",
  },
} as const;

export const UPLOAD_PROGRESS = {
  INITIAL: 0,
  MAX_BEFORE_COMPLETE: 90,
  COMPLETE: 100,
  INCREMENT: 10,
  INTERVAL_MS: 200,
  COMPLETE_DELAY_MS: 500,
} as const;

export const UI_TEXT = {
  APP_NAME: "BANRESERVAS",
  SYSTEM_SUBTITLE: "Sistema de Archivos",
  LOADING_MESSAGE: "Cargando...",
  ENCRYPT_BUTTON: "Encriptar documento",
  DECRYPT_BUTTON: "Descargar documento",
  HISTORY_BUTTON: "Historial",
  PROFILE_BUTTON: "Perfil",
} as const;
