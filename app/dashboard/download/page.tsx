import { FilesDataTable } from "@/components/files-data-table";
import { ArchivoInfo } from "@/lib/api";

interface DecryptPageProps {
  loading: boolean;
  downloadableFiles: ArchivoInfo[];
  handleFileDownload: (file: ArchivoInfo) => void;
  handleFileDownloadOriginal: (file: ArchivoInfo) => void;
  handleFileDelete: (fileId: number) => void;
}

export default function DecryptPage({
  loading,
  downloadableFiles,
  handleFileDownload,
  handleFileDownloadOriginal,
  handleFileDelete,
}: DecryptPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Descargar Documento</h2>
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando archivos...</p>
        </div>
      ) : (
        <FilesDataTable
          files={downloadableFiles}
          showDownloadButton={true}
          onDownload={handleFileDownload}
          onDownloadOriginal={handleFileDownloadOriginal}
          onDelete={handleFileDelete}
          itemsPerPage={10}
        />
      )}
    </div>
  );
}
