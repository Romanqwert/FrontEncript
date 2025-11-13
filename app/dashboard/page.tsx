"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Lock,
  Unlock,
  History,
  Upload,
  FileText,
  Plus,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, type ArchivoInfo, type UserProfile } from "@/lib/api";
import BanreservasLogo from "@/components/banreservas-logo";
import { StatusModal } from "@/components/status-modal";
import { ProgressModal } from "@/components/progress-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FilesDataTable } from "@/components/files-data-table";
import {
  type HistorialInfo,
  HistoryDataTable,
} from "@/components/history-data-table";
import { FileUploadModal } from "@/components/file-upload-modal";
import { PasswordModal } from "@/components/password-modal";
import { EncryptPage } from "./encrypt/page";
import { DecryptPage } from "./download/page";
import { HistoryPage } from "./history/page";
import { ProfilePage } from "./profile/page";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "encrypt" | "decrypt" | "history" | "profile"
  >("encrypt");
  const [history, setHistory] = useState<HistorialInfo[]>([]);
  const [downloadableFiles, setDownloadableFiles] = useState<ArchivoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordModalType, setPasswordModalType] = useState<
    "upload" | "download"
  >("upload");
  const [pendingEncryptTargets, setPendingEncryptTargets] = useState<
    string[] | null
  >(null);
  const [pendingDownloadFile, setPendingDownloadFile] =
    useState<ArchivoInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadUserProfile();
    if (activeTab === "history") {
      loadHistory();
    } else if (activeTab === "decrypt") {
      loadDownloadableFiles();
    }
  }, [activeTab, router]);

  const loadUserProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await api.listHistory();
      setHistory(history);
    } catch (error) {
      setModalType("error");
      setModalMessage("Error al cargar archivos");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const loadDownloadableFiles = async () => {
    try {
      setLoading(true);
      const fileList = await api.listFilesForDownload();
      setDownloadableFiles(fileList);
    } catch (error) {
      setModalType("error");
      setModalMessage("Error al cargar archivos para descargar");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setShowUploadModal(true);
  };

  const handleUploadConfirm = async (encryptTargets: string[] | null) => {
    if (!selectedFile) return;

    setPendingEncryptTargets(encryptTargets);
    setPasswordModalType("upload");
    setShowPasswordModal(true);
    setShowUploadModal(false);
  };

  const handlePasswordConfirmed = async (password: string) => {
    if (passwordModalType === "upload" && selectedFile) {
      await performUpload(password);
    } else if (passwordModalType === "download" && pendingDownloadFile) {
      await performDownload(password);
    }
    setShowPasswordModal(false);
  };

  const performUpload = async (password: string) => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await api.uploadFile(selectedFile, pendingEncryptTargets, password);
      setUploadProgress(100);
      setTimeout(() => {
        setModalType("success");
        setModalMessage("Archivo encriptado y subido correctamente");
        setShowModal(true);
        setUploading(false);
        setSelectedFile(null);
        setPendingEncryptTargets(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setModalType("error");
      setModalMessage("Error al subir archivo");
      setShowModal(true);
      setUploading(false);
      setSelectedFile(null);
      setPendingEncryptTargets(null);
    }
  };

  const performDownload = async (password: string) => {
    if (!pendingDownloadFile) return;

    try {
      await api.downloadFileOriginal(
        pendingDownloadFile.idArchivo,
        pendingDownloadFile.nombreArchivo,
        password
      );
      setModalType("success");
      setModalMessage("Archivo descargado y desencriptado correctamente");
      setShowModal(true);
      setPendingDownloadFile(null);
    } catch (error) {
      setModalType("error");
      setModalMessage("Error al descargar archivo");
      setShowModal(true);
      setPendingDownloadFile(null);
    }
  };

  const handleFileDownload = async (file: ArchivoInfo) => {
    try {
      await api.downloadFile(file.idArchivo, file.nombreArchivo);
      setModalType("success");
      setModalMessage("Archivo descargado y desencriptado correctamente");
      setShowModal(true);
    } catch (error) {
      setModalType("error");
      setModalMessage("Error al descargar archivo");
      setShowModal(true);
    }
  };

  const handleFileDownloadOriginal = async (file: ArchivoInfo) => {
    setPendingDownloadFile(file);
    setPasswordModalType("download");
    setShowPasswordModal(true);
  };

  const handleLogout = () => {
    api.logout();
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <BanreservasLogo
            className="h-10 w-10 text-sidebar-foreground"
            imageSrc="/isotipo.svg"
          />
          <div>
            <h1 className="text-lg font-bold">BANRESERVAS</h1>
            <p className="text-xs opacity-80">Sistema de Archivos</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => {
            setActiveTab("encrypt");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "encrypt"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
          }`}
        >
          <Lock className="h-5 w-5" />
          <span className="font-medium">Encriptar documento</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("decrypt");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "decrypt"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
          }`}
        >
          <Unlock className="h-5 w-5" />
          <span className="font-medium">Descargar documento</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("history");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "history"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
          }`}
        >
          <History className="h-5 w-5" />
          <span className="font-medium">Historial</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("profile");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "profile"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="font-medium">Perfil</span>
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:block w-64 border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col">
        <header className="bg-primary text-primary-foreground border-b border-sidebar-border">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-primary-foreground hover:bg-primary/90"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div className="flex items-center gap-3">
                <BanreservasLogo
                  className="h-8 w-8 text-primary-foreground"
                  imageSrc="/isotipo.svg"
                />
                <h1 className="text-lg font-bold hidden sm:block">
                  BANRESERVAS
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm hidden sm:inline">Banreservas</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground hover:bg-primary/90"
                onClick={() => setActiveTab("profile")}
              >
                <Avatar className="h-8 w-8 bg-white">
                  <AvatarFallback className="bg-white text-primary font-semibold">
                    {userProfile?.nombreUsuario.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {activeTab === "encrypt" && (
            <EncryptPage
              handleFileUpload={handleFileUpload}
              fileInputRef={fileInputRef}
            />
          )}

          {activeTab === "decrypt" && (
            <DecryptPage
              loading
              downloadableFiles={downloadableFiles}
              handleFileDownload={handleFileDownload}
              handleFileDownloadOriginal={handleFileDownloadOriginal}
            />
          )}

          {activeTab === "history" && <HistoryPage loading history={history} />}

          {activeTab === "profile" && userProfile && (
            <ProfilePage
              userProfile={userProfile}
              handleLogout={handleLogout}
            />
          )}
        </main>
      </div>

      <FileUploadModal
        open={showUploadModal}
        file={selectedFile}
        onConfirm={handleUploadConfirm}
        onCancel={() => {
          setShowUploadModal(false);
          setSelectedFile(null);
        }}
      />

      <PasswordModal
        open={showPasswordModal}
        title={
          passwordModalType === "upload"
            ? "Contraseña de Encriptación"
            : "Contraseña de Desencriptación"
        }
        description={
          passwordModalType === "upload"
            ? "Ingrese una contraseña para encriptar el archivo"
            : "Ingrese la contraseña para desencriptar el archivo"
        }
        onConfirm={handlePasswordConfirmed}
        onCancel={() => {
          setShowPasswordModal(false);
          setPendingEncryptTargets(null);
          setPendingDownloadFile(null);
        }}
        isLoading={uploading}
      />

      <StatusModal
        open={showModal}
        onOpenChange={setShowModal}
        type={modalType}
        message={modalMessage}
      />

      <ProgressModal
        open={uploading}
        progress={uploadProgress}
        message="Cargando..."
      />
    </div>
  );
}
