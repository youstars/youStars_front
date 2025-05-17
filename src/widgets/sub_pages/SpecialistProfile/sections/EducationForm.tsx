import { useState, useEffect } from "react";
import styles from "./EducationForm.module.scss";

interface EducationFormProps {
  value: { university: string; faculty: string };
  onChange: (edu: { university: string; faculty: string }) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState(value.university || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!query) return;

    const delay = setTimeout(async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/suggest-educations/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ query: query.trim() }),
        });

        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error("Ошибка получения университетов:", err);
      }
    }, 200);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (item: any) => {
    onChange({ university: item.value, faculty: value.faculty });
    setQuery(item.value);
    setSuggestions([]);
    setIsFocused(false); // скрываем список
  };

  return (
    <div className={styles.form}>
      <label>Образование (введите вуз)</label>
     <div className={styles.inputWrapper}>
  <input
    type="text"
    value={query}
    onChange={(e) => {
      setQuery(e.target.value);
      onChange({ university: e.target.value, faculty: value.faculty });
    }}
    onFocus={() => setIsFocused(true)}
    onBlur={() => setTimeout(() => setIsFocused(false), 150)}
    placeholder="Например, МГУ, ИТМО"
  />
  {isFocused && suggestions.length > 0 && (
    <ul className={styles.dropdown}>
      {suggestions.map((s, i) => (
        <li key={i} onClick={() => handleSelect(s)}>
          <strong>{s.value}</strong>
        </li>
      ))}
    </ul>
  )}
</div>


      <label>Факультет / специальность</label>
      <input
        type="text"
        value={value.faculty}
        onChange={(e) => onChange({ university: value.university, faculty: e.target.value })}
        placeholder="Например, юриспруденция"
      />
    </div>
  );
};

export default EducationForm;
