import React, { useState } from 'react';
import styles from './ContactInfoSection.module.scss';

interface Props {
  onSubmit: (data: {
    email: string;
    username: string;
    company: string;
    phone?: string;
  }) => void;
}

const ContactInfoSection: React.FC<Props> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (email && username && company) {
      onSubmit({ email, username, company, phone });
    } else {
      alert('Пожалуйста, заполните обязательные поля');
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <input
          className={styles.input}
          type="email"
          placeholder="* Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <input
          className={styles.input}
          type="text"
          placeholder="* Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <input
          className={styles.input}
          type="text"
          placeholder="* Название компании"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <input
          className={styles.input}
          type="text"
          placeholder="Телефон (по желанию)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        Продолжить
      </button>
    </div>
  );
};

export default ContactInfoSection;
