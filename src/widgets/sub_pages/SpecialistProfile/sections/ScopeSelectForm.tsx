import { useState, useEffect } from "react";
import styles from "./ScopeSelectForm.module.scss";

interface ScopeSelectFormProps {
  value: string[];
  onChange: (updatedScopes: string[]) => void;
}

const predefinedScopes = [
  "Маркетинг",
  "Продажи",
  "Образование",
  "Программирование",
  "Финансы",
  "HR",
  "Дизайн",
  "Логистика",
  "Консалтинг",
];

const ScopeSelectForm: React.FC<ScopeSelectFormProps> = ({ value, onChange }) => {
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    if (!input) {
      setFiltered([]);
    } else {
      const lower = input.toLowerCase();
      setFiltered(predefinedScopes.filter(scope =>
        scope.toLowerCase().includes(lower) && !value.includes(scope)
      ));
    }
  }, [input, value]);

  const handleSelect = (scope: string) => {
    onChange([...value, scope]);
    setInput("");
    setFiltered([]);
  };

  const handleRemove = (scope: string) => {
    onChange(value.filter(item => item !== scope));
  };

  return (
    <div className={styles.wrapper}>
      <label>Опыт в нишах</label>
      <div className={styles.selected}>
        {value.map((scope, i) => (
          <span key={i} className={styles.tag}>
            {scope}
            <button onClick={() => handleRemove(scope)}>×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Добавить нишу..."
        className={styles.input}
      />
      {filtered.length > 0 && (
        <ul className={styles.dropdown}>
          {filtered.map((scope, i) => (
            <li key={i} onClick={() => handleSelect(scope)}>
              {scope}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScopeSelectForm;
