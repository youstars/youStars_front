import LibraryItem from "./components/LibraryItem";
import styles from "./Library.module.scss";
import FilterBtn from "shared/UI/FilterBtn/FilterBtn";
import SearchInput from "shared/UI/SearchInput/SearchInput";



export type FileItem = {
  name: string;
  type: "folder" | "file";
  children?: FileItem[]; 
};


const data: FileItem[] = [
  {
    name: "Маркетинг",
    type: "folder",
    children: [
      { name: "Исследование рынка.pdf", type: "file" },
      {
        name: "Вложения",
        type: "folder",
        children: [
          { name: "Анализ конкурентов.pdf", type: "file" },
          { name: "Портфель брендов.pdf", type: "file" },
        ],
      },
      {
        name: "Еще вложения",
        type: "folder",
        children: [
          { name: "Анализ конкурентов.pdf", type: "file" },
          { name: "Портфель брендов.pdf", type: "file" },
        ],
      },
      
    ],
  },
  { name: "Финансы", type: "folder", children: [] },
];

const Library = () => (
  <div className={styles.main}>
    <div className={styles.header}>
<FilterBtn />
<SearchInput />
    </div>
  <div className={styles.container}>
    {data.map((item, idx) => (
      <LibraryItem key={idx} item={item} />
    ))}
  </div>
  </div>
);
export default Library;