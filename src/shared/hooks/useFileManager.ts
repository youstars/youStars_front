import { useState, useEffect, useRef } from "react";
import { deleteFileById } from "shared/api/files";
import type { FileItem } from "shared/UI/ProjectFiles/ProjectFiles";


export function useFileManager(
  initialFiles: FileItem[],
  uploadFn: (file: File) => Promise<any>,
  ownerId: number,
  fileType: "client" | "specialist" | "project" | "admin" 
) {
  const [files, setFiles] = useState<FileItem[]>([]);

const hasInitialized = useRef(false);

useEffect(() => {
  if (!hasInitialized.current) {
    setFiles(initialFiles || []);
    hasInitialized.current = true;
  }
}, []);


const handleFileSelect = async (file: File) => {
  if (!ownerId) return;

  const response = await uploadFn(file); 

  const newFile: FileItem = {
    id: response.id,
    name: response.name,
    fileUrl: response.file,
  };

  setFiles((prev) => [...prev, newFile]);
};

  const handleDeleteFile = async (file: FileItem) => {
    await deleteFileById(fileType, file.id);
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
  };

  return { files, handleFileSelect, handleDeleteFile };
}
