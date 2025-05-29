import React, { useEffect, useRef } from "react";
import styles from "./LibraryDropdownMenu.module.scss";
import PlusIcon from "shared/assets/libraryIcons/plus-yellow.svg";
import FolderIcon from "shared/assets/libraryIcons/folder-plus-yellow.svg";
import RenameIcon from "shared/assets/libraryIcons/edit.svg";
import PinIcon from "shared/assets/libraryIcons/bookmark.svg";


interface Props {
  onClose: () => void;
  onDelete: () => void;
  onRename?: () => void;
  onAddFile?: () => void;
  onAddFolder?: () => void;
  onPin?: () => void;
}

const LibraryDropdownMenu: React.FC<Props> = ({
  onClose,
  onDelete,
  onRename,
  onAddFile,
  onAddFolder,
  onPin,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
   <div ref={menuRef} className={styles.dropdownMenu}>
  <button className={styles.dropdownItem} onClick={onAddFile}>
    <span className={styles.label}>Новый файл</span>
    <img src={PlusIcon} className={styles.icon} alt="+" />
  </button>
  <button className={styles.dropdownItem} onClick={onAddFolder}>
    <span className={styles.label}>Новая папка</span>
    <img src={FolderIcon} className={styles.icon} alt="folder" />
  </button>
  <button className={styles.dropdownItem} onClick={onRename}>
    <span className={styles.label}>Переименовать</span>
    <img src={RenameIcon} className={styles.icon} alt="rename" />
  </button>
  <button className={styles.dropdownItem} onClick={onPin}>
    <span className={styles.label}>Закрепить</span>
    <img src={PinIcon} className={styles.icon} alt="pin" />
  </button>
  <button className={styles.deleteItem} onClick={onDelete}>
    <span className={styles.label}>Удалить</span>
    <span className={styles.iconPlaceholder} />
  </button>
</div>

  );
};

export default LibraryDropdownMenu;
