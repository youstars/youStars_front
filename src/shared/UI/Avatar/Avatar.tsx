import React, { useRef } from 'react';
import styles from './Avatar.module.scss';
import user_icon from "shared/images/user_icon.svg";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: string;
  onUpload?: (file: File) => void; 
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = "40px", onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (onUpload) {
      inputRef.current?.click();
    } else {
      console.log("onUpload не передан, загрузка отключена");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      console.log("Файл выбран:", file.name);
      onUpload(file);
    }
  };

  return (
    <div
      className={styles.wrapper}
      style={{ width: size, height: size }}
      onClick={handleClick}
    >
      <img
        src={src || user_icon}
        alt={alt || "Аватар"}
        className={styles.avatar}
        style={{ width: size, height: size }}
      />
      {onUpload && (
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default Avatar;
