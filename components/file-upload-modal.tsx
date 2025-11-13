"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { ChevronRight } from "lucide-react";

interface FileUploadModalProps {
  open: boolean;
  file: File | null;
  onConfirm: (encryptTargets: string[] | null) => void;
  onCancel: () => void;
}

export function FileUploadModal({
  open,
  file,
  onConfirm,
  onCancel,
}: FileUploadModalProps) {
  const [fileContent, setFileContent] = useState<string>("");
  const [keys, setKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    if (open && file) {
      loadFileContent();
    }
  }, [open, file]);

  const loadFileContent = async () => {
    if (!file) return;
    setSelectedKeys(new Set());
    setIsLoadingContent(true);
    try {
      const content = await file.text();
      setFileContent(content);

      // Extract keys if it's a JSON, XML, or CONFIG file
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (fileExt === "json") {
        extractJsonKeys(content);
      } else if (fileExt === "xml") {
        extractXmlKeys(content);
      } else if (fileExt === "config") {
        extractConfigKeys(content);
      } else {
        setKeys([]);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      setFileContent("Error al leer el archivo");
      setKeys([]);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const extractJsonKeys = (content: string) => {
    try {
      const json = JSON.parse(content);
      const extractedKeys = extractKeysFromObject(json);
      setKeys(extractedKeys);
    } catch {
      setKeys([]);
    }
  };

  const extractKeysFromObject = (obj: any, prefix = ""): string[] => {
    const keys: string[] = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keys.push(fullKey);

        if (typeof obj[key] === "object" && obj[key] !== null) {
          keys.push(...extractKeysFromObject(obj[key], fullKey));
        }
      }
    }

    return keys;
  };

  const extractXmlKeys = (content: string) => {
    const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
    const foundKeys = new Set<string>();
    let match;

    while ((match = tagRegex.exec(content)) !== null) {
      foundKeys.add(match[1]);
    }

    setKeys(Array.from(foundKeys));
  };

  const extractConfigKeys = (content: string) => {
    const lines = content.split("\n");
    const foundKeys = new Set<string>();

    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (
        cleanLine &&
        !cleanLine.startsWith("#") &&
        !cleanLine.startsWith(";")
      ) {
        const keyMatch = cleanLine.match(/^([^=:]+)[=:]/);
        if (keyMatch) {
          foundKeys.add(keyMatch[1].trim());
        }
      }
    });

    setKeys(Array.from(foundKeys));
  };

  // Helper to get all children keys of a parent key
  const getChildKeys = (parentKey: string): string[] => {
    return keys.filter((k) => k.startsWith(parentKey + "."));
  };

  // Helper to check if a key is a parent (has children)
  const isParentKey = (key: string): boolean => {
    return keys.some((k) => k.startsWith(key + "."));
  };

  // Get the depth level of a key
  const getKeyDepth = (key: string): number => {
    return key.split(".").length - 1;
  };

  const toggleKey = (key: string) => {
    const newSelected = new Set(selectedKeys);
    const isCurrentlySelected = newSelected.has(key);

    if (isCurrentlySelected) {
      // Deselect this key and all its children
      newSelected.delete(key);
      const children = getChildKeys(key);
      children.forEach((child) => newSelected.delete(child));
    } else {
      // Select this key and all its children
      newSelected.add(key);
      const children = getChildKeys(key);
      children.forEach((child) => newSelected.add(child));
    }

    setSelectedKeys(newSelected);
  };

  const handleConfirm = () => {
    const encryptTargets =
      selectedKeys.size > 0 ? Array.from(selectedKeys) : null;
    onConfirm(encryptTargets);
  };

  const hasKeys = keys.length > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Previsualizar y Configurar Encriptación</DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden min-h-0">
          {/* File Preview */}
          <div className="flex flex-col min-h-0">
            <Label className="mb-2 font-semibold">Contenido del archivo:</Label>
            <ScrollArea className="h-[400px] border border-border rounded-md bg-muted">
              <pre className="text-sm whitespace-pre-wrap break-words font-mono text-muted-foreground p-4">
                {isLoadingContent ? "Cargando..." : fileContent}
              </pre>
            </ScrollArea>
          </div>

          {/* Key Selection */}
          <div className="flex flex-col min-h-0">
            <Label className="mb-2 font-semibold">
              {hasKeys
                ? `Seleccionar campos a encriptar (${selectedKeys.size}/${keys.length})`
                : "Este archivo no tiene campos extractibles"}
            </Label>
            {hasKeys ? (
              <ScrollArea className="h-[400px] border border-border rounded-md">
                <div className="p-4 space-y-1">
                  {keys.map((key) => {
                    const depth = getKeyDepth(key);
                    const isParent = isParentKey(key);
                    const isSelected = selectedKeys.has(key);
                    const keyName = key.split(".").pop() || key;

                    return (
                      <div
                        key={key}
                        className="flex items-center space-x-2 group hover:bg-accent/50 rounded-md py-1 px-2 transition-colors"
                        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
                      >
                        {isParent && (
                          <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                        {!isParent && <div className="w-3" />}
                        <Checkbox
                          id={key}
                          checked={isSelected}
                          onCheckedChange={() => toggleKey(key)}
                          className="flex-shrink-0"
                        />
                        <Label
                          htmlFor={key}
                          className="font-normal cursor-pointer flex-1 text-sm"
                          title={key}
                        >
                          <span className={isParent ? "font-medium" : ""}>
                            {keyName}
                          </span>
                          {isSelected && isParent && (
                            <span className="ml-2 text-xs text-muted-foreground italic">
                              (incluye {getChildKeys(key).length} hijo
                              {getChildKeys(key).length !== 1 ? "s" : ""})
                            </span>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[400px] border border-border rounded-md p-4 flex items-center justify-center text-muted-foreground text-sm">
                Encriptará todo el archivo
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Encriptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
