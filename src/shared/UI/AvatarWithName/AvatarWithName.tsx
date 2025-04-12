import React from "react";
import styles from "./AvatarWithName.module.scss";

interface Props {
  src: string;
  name: string;
}

const AvatarWithName: React.FC<Props> = ({ src, name }) => {
  return (
    <div className={styles.container}>
      <img src={src} className={styles.avatar} alt={name} />
      <span>{name}</span>
    </div>
  );
};

export default AvatarWithName;
