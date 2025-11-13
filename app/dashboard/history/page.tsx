import {
  HistorialInfo,
  HistoryDataTable,
} from "@/components/history-data-table";

interface HistoryPageProps {
  loading: boolean;
  history: HistorialInfo[];
}

export function HistoryPage({ loading, history }: HistoryPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Historial de Archivos</h2>
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando archivos...</p>
        </div>
      ) : (
        <HistoryDataTable history={history} itemsPerPage={10} />
      )}
    </div>
  );
}
