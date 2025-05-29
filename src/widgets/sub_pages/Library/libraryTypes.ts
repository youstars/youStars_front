export type FileItem = {
    id: number; 
  name: string;
  type: "folder" | "file";
  children?: FileItem[];
};
