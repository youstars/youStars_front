import { useEffect, useMemo } from "react";
import LibraryItem from "./components/LibraryItem/LibraryItem";
import styles from "./Library.module.scss";
import FilterBtn from "shared/UI/FilterBtn/FilterBtn";
import SearchInput from "shared/UI/SearchInput/SearchInput";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { fetchFolders } from "shared/store/slices/foldersSlice";
import { selectFolders } from "shared/store/slices/foldersSlice";
import { addFolder } from "shared/store/slices/foldersSlice";
import { FolderItem } from "shared/store/slices/foldersSlice";
import { FoldersState } from "shared/store/slices/foldersSlice";
import { FileItem } from "./libraryTypes";
import { fetchKnowledgeFiles } from "shared/store/slices/librarySlice";
import FolderIcon from "shared/assets/libraryIcons/folder-plus.svg";
import PlusIcon from "shared/assets/libraryIcons/plus.svg";



const Library = () => {
  const dispatch = useAppDispatch();

  const foldersState = useAppSelector(selectFolders) as FoldersState;

  const { folders, loading, error } = foldersState;
  console.log("folders ===>", folders);

  useEffect(() => {
    dispatch(fetchFolders());
  dispatch(fetchKnowledgeFiles());
  }, [dispatch]);

  const handleCreateFolder = () => {
    const folderName = prompt("Введите имя новой папки:");
    if (folderName) {
      dispatch(addFolder({ name: folderName }));
    }
  };
function mapFolderToFile(folder: FolderItem): FileItem {
  return {
    id: folder.id, 
    name: folder.name,
    type: "folder",
    children: folder.children?.map(mapFolderToFile),
  };
}
function buildFolderTree(folders: FolderItem[]): FolderItem[] {
  const map = new Map<number, FolderItem & { children: FolderItem[] }>();

  folders.forEach((folder) => {
    map.set(folder.id, { ...folder, children: [] });
  });

  const tree: FolderItem[] = [];

  map.forEach((folder) => {
    if (folder.parent && map.has(folder.parent)) {
      map.get(folder.parent)!.children!.push(folder);
    } else {
      tree.push(folder);
    }
  });

  return tree;
}

const treeFolders = useMemo(() => buildFolderTree(folders), [folders]);


  return (
    <div className={styles.main}>
      <div className={styles.header}>
  <div className={styles.left}>
    <FilterBtn />
  </div>

<div className={styles.center}>
  <div className={styles.searchWrapper}>
    <SearchInput placeholder="Поиск клиента" />
  </div>
</div>


  <div className={styles.right}>
    <button onClick={handleCreateFolder} className={styles.iconButton}>
      <img src={FolderIcon} alt="folder" />
    </button>
    <button onClick={() => alert("Добавить файл")} className={styles.iconButton}>
      <img src={PlusIcon} alt="plus" />
    </button>
  </div>
</div>


      <div className={styles.container}>
        {loading && <p>Загрузка...</p>}
        {error && <p className={styles.error}>Ошибка: {error}</p>}
        {folders.length === 0 ? (
          <p>Нет папок</p>
        ) : (
         treeFolders.map((item) => (
  <LibraryItem key={item.id} item={mapFolderToFile(item)} />
))
        )}
      </div>
    </div>
  );
};

export default Library;
