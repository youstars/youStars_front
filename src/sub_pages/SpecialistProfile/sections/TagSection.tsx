import React from "react";
import styles from "./TagSection.module.scss"; 

interface TagSectionProps {
  title: string;
  tags: string[];
  className?: string;
  align?: "left" | "center";
}

const TagSection: React.FC<TagSectionProps> = ({ title, tags, className, align="left" }) => {
  return (
    <div className={styles.container}>
      <h4 className={`${styles.subtitle} ${align === "center" ? styles.center : ""}`}>{title}</h4>
      <div className={styles.tags}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSection;
