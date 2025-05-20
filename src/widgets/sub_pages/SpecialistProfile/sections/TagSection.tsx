import { useState } from "react";
import styles from "./TagSection.module.scss";

interface TagSectionProps {
  title: string;
  tags: string[];
  className?: string;
  align?: 'left' | 'center' | 'right';
  onAddClick?: (value: string) => void; // измени тип
  addIcon?: React.ReactNode;
}

const TagSection: React.FC<TagSectionProps> = ({
  title,
  tags,
  className,
  align = "left",
  onAddClick,
  addIcon,
}) => {
  const [adding, setAdding] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleAdd = () => {
    if (newTag.trim() && onAddClick) {
      onAddClick(newTag.trim());
      setNewTag("");
      setAdding(false);
    }
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.header}>
        <h4 className={`${styles.subtitle} ${align === "center" ? styles.center : ""}`}>
          {title}
        </h4>
      </div>

      <div className={styles.tags}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tag}>{tag}</span>
        ))}

        {adding ? (
           <div className={styles.inputWrapper}>
           <input
             type="text"
             value={newTag}
             onChange={(e) => setNewTag(e.target.value)}
             placeholder="Добавить услугу..."
             className={styles.tag} 
           />
           <button onClick={handleAdd} className={styles.confirmButton}>✔</button>
           <button onClick={() => setAdding(false)} className={styles.cancelButton}>✖</button>
         </div>
        ) : (
          onAddClick && (
            <button className={styles.addButton} onClick={() => setAdding(true)}>
              {addIcon}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default TagSection;
