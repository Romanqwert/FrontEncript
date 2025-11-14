import { Button } from "@/components/ui/button";
import { FileText, Plus, Upload } from "lucide-react";
import { Ref } from "react";

interface EncryptPageProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: Ref<HTMLInputElement> | undefined;
}

export default function EncryptPage({
  handleFileUpload,
  fileInputRef,
}: EncryptPageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <Plus className="h-6 w-6 text-muted-foreground absolute translate-x-4 translate-y-4" />
        </div>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Haga clic en "Agregar" para encriptar
        </p>
        <label htmlFor="file-upload">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <span className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Agregar Archivo
            </span>
          </Button>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
      </div>
    </div>
  );
}
