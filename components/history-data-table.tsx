"use client";

import { useState } from "react";
import {
  Clock,
  User,
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
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

export interface HistorialInfo {
  idHistorial: number;
  idUsuario: number;
  idAlgoritmo: number;
  accion: string;
  fechaAccion: string;
  resultado: string;
  ipOrigen: string;
}

interface HistoryDataTableProps {
  history: HistorialInfo[];
  itemsPerPage?: number;
}

export function HistoryDataTable({
  history,
  itemsPerPage = 10,
}: HistoryDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHistory = history.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (history.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No hay historial disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>ID</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead className="hidden sm:table-cell">Resultado</TableHead>
              <TableHead className="hidden md:table-cell">
                Fecha de Acción
              </TableHead>
              <TableHead className="hidden lg:table-cell">IP Origen</TableHead>
              <TableHead className="hidden xl:table-cell">
                Algoritmo ID
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentHistory.map((item) => (
              <TableRow key={item.idHistorial} className="border-border">
                <TableCell className="font-medium">
                  {item.idHistorial}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    {item.accion}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {item.resultado}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {formatDate(item.fechaAccion)}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {item.ipOrigen}
                </TableCell>
                <TableCell className="hidden xl:table-cell text-muted-foreground">
                  {item.idAlgoritmo}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, history.length)} de{" "}
            {history.length} registros
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
