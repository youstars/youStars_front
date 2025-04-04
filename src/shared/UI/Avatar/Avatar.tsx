import React from 'react';
import styles from './Avatar.module.scss';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: string
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size="40px" }) => {
  const defaultAvatar =
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return <img src={src || defaultAvatar} alt={alt || 'Аватар'} className={styles.avatar} style={{width:size, height:size}} />;
};

export default Avatar;
