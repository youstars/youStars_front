// LibraryItem.tsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./LibraryItem.module.scss";
import ArrowIcon from "shared/assets/icons/arrowDown.svg";
import FileIcon from "shared/assets/icons/file.svg";
import { use } from "i18next";
import LibraryDropdownMenu from "../LibraryDropdownMenu/LibraryDropdownMenu";
import {
  deleteFolder,
  addFolder,
  renameFolder,
} from "shared/store/slices/foldersSlice";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { FileItem } from "../../libraryTypes";
import { useAppSelector } from "shared/hooks/useAppSelector";
import {
  uploadKnowledgeFile,
  deleteKnowledgeFile,
  selectKnowledgeFiles,
} from "shared/store/slices/librarySlice";
import FileDropdownMenu from "../FileDropdownMenu/FileDropdownMenu";

interface Props {
  item: FileItem;
  level?: number;
}

const LibraryItem: React.FC<Props> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = item.type === "folder";
  const childrenRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [fileMenuOpenId, setFileMenuOpenId] = useState<number | null>(null);

  const files = useAppSelector(selectKnowledgeFiles);
  const filesInThisFolder = item.id
    ? files.filter((file) => file.folder === item.id)
    : [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && childrenRef.current) {
      const height = childrenRef.current.scrollHeight;
      setLineHeight(height);
    }
  }, [isOpen]);

  return (
    <div className={styles.item} style={{ marginLeft: level * 16 }}>
   
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile && item.id) {
            // console.log(" Отправка файла:", selectedFile.name);
            dispatch(
              uploadKnowledgeFile({
                file: selectedFile,
                folder: item.id,
                audience: 1,
              })
            );
          }
          e.target.value = "";
        }}
      />

      <div
        className={styles.itemHeader}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
          <img
            src={ArrowIcon}
            className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
            alt="arrow"
          />
        ) : (
          <img src={FileIcon} alt="file" className={styles.icon} />
        )}
        <span>{item.name}</span>

        <div className={styles.menuWrapper}>
          <button
            className={styles.menuButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            ⋮
          </button>

          {showMenu && (
            <LibraryDropdownMenu
              onClose={() => setShowMenu(false)}
              onRename={() => {
                const newName = prompt("Введите новое имя папки:", item.name);
                if (newName && newName !== item.name && item.id) {
                  dispatch(renameFolder({ id: item.id, name: newName }));
                }
              }}
              onDelete={() => {
                setShowMenu(false);
                // eslint-disable-next-line no-restricted-globals
                if (confirm(`Удалить папку "${item.name}"?`)) {
                  dispatch(deleteFolder(item.id));
                }
              }}
              onAddFile={() => {
                // console.log(" Клик по кнопке — input:", fileInputRef.current);
                fileInputRef.current?.click();
              }}
              onAddFolder={() => {
                const folderName = prompt("Введите имя новой папки:");
                if (folderName && item.id) {
                  dispatch(addFolder({ name: folderName, parent: item.id }));
                }
              }}
              onPin={() => console.log("Закрепить")}
            />
          )}
        </div>
      </div>

      {isFolder && isOpen && (
        <div
          className={styles.children}
          ref={childrenRef}
          style={{ position: "relative" }}
        >
          <div
            className={`${styles.verticalLine} ${
              lineHeight ? styles.active : ""
            }`}
            style={{ height: lineHeight }}
          />


          {[...(item.children || []), ...filesInThisFolder].map((entry, idx) =>
            "type" in entry ? (
              <LibraryItem
                key={`folder-${idx}`}
                item={entry}
                level={level + 1}
              />
            ) : (
              <div
                key={`file-${entry.id}`}
                className={styles.file}
                style={{ marginLeft: 0 }}
              >
                <div className={styles.fileContent}>
                  <img src={FileIcon} className={styles.icon} alt="file" />
                  <span className={styles.name}>{entry.name}</span>
                </div>
                <div className={styles.menuWrapper}>
                  <button
                    className={styles.menuButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileMenuOpenId(entry.id);
                    }}
                  >
                    ⋮
                  </button>

                  {fileMenuOpenId === entry.id && (
                    <FileDropdownMenu
                      onClose={() => setFileMenuOpenId(null)}
                      onDelete={() => {
                        setFileMenuOpenId(null);
                        // eslint-disable-next-line no-restricted-globals
                        if (confirm(`Удалить файл "${entry.name}"?`)) {
                          dispatch(deleteKnowledgeFile(entry.id));
                        }
                      }}
                      onRename={() =>
                        console.log("Переименовать файл:", entry.name)
                      }
                      onPin={() => console.log("Закрепить файл:", entry.name)}
                    />
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryItem;
