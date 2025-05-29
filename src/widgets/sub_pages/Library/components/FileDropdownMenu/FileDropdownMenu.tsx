import React, { useEffect, useRef } from "react";
import styles from "./FileDropdownMenu.module.scss";
import RenameIcon from "shared/assets/libraryIcons/edit.svg";
import PinIcon from "shared/assets/libraryIcons/bookmark.svg";


interface Props {
  onClose: () => void;
  onDelete: () => void;
  onRename?: () => void;
  onPin?: () => void;
}

const FileDropdownMenu: React.FC<Props> = ({
  onClose,
  onDelete,
  onRename,
  onPin,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={menuRef} className={styles.dropdownMenu}>
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

export default FileDropdownMenu;
