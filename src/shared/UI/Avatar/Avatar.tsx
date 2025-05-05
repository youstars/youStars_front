import React from 'react';
import styles from './Avatar.module.scss';
import user_icon from "shared/images/user_icon.svg";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: string
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size="40px" }) => {
 

  return (
    <img
    src={src || user_icon} 
    alt={alt || 'Аватар'}
    className={styles.avatar}
    style={{ width: size, height: size }}
  />
  )
};

export default Avatar;
