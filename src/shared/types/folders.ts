export interface FolderItem {
  id: number;
  name: string;
  parent?: number | null;
  children?: FolderItem[];
}
