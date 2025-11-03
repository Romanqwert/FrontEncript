"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ArchivoInfo } from "@/lib/api";

interface FilesDataTableProps {
  files: ArchivoInfo[];
  showDownloadButton?: boolean;
  onDownload?: (file: ArchivoInfo) => void;
  onDownloadOriginal?: (file: ArchivoInfo) => void;
  itemsPerPage?: number;
}

export function FilesDataTable({
  files,
  showDownloadButton = false,
  onDownload,
  onDownloadOriginal,
  itemsPerPage = 10,
}: FilesDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = files.slice(startIndex, endIndex);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = async (
    file: ArchivoInfo,
    type: "encrypted" | "original"
  ) => {
    setDownloadingId(file.idArchivo);
    try {
      if (type === "encrypted") await onDownload?.(file);
      else await onDownloadOriginal?.(file);
    } finally {
      // 🔹 Se reactivan los botones al terminar
      setDownloadingId(null);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (files.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No hay archivos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-12"></TableHead>
              <TableHead>Nombre del Archivo</TableHead>
              <TableHead className="hidden md:table-cell">Tamaño</TableHead>
              <TableHead className="hidden lg:table-cell">
                Fecha de Subida
              </TableHead>
              {showDownloadButton && (
                <>
                  <TableHead className="text-right">
                    Descargar Encriptado
                  </TableHead>
                  <TableHead className="text-right">
                    Descargar Original
                  </TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFiles.map((file) => {
              const isDownloading = downloadingId === file.idArchivo;
              return (
                <TableRow key={file.idArchivo} className="border-border">
                  <TableCell>
                    <FileText className="h-5 w-5 text-primary" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-xs truncate">
                      {file.nombreArchivo}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatFileSize(file.tamanoBytes)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {formatDate(file.fechaSubida)}
                  </TableCell>
                  {showDownloadButton && (
                    <>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleDownload(file, "encrypted")}
                          size="sm"
                          disabled={isDownloading}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cargando...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleDownload(file, "original")}
                          size="sm"
                          variant="outline"
                          disabled={isDownloading}
                          className="border-border hover:bg-muted"
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cargando...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Original
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, files.length)} de{" "}
            {files.length} archivos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-border"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className={
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "border-border"
                        }
                      >
                        {page}
                      </Button>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-border"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
