import { useState, useEffect } from "react";
import styles from "widgets/sub_pages/SpecialistProfile/sections/Other/EducationForm/EducationForm.module.scss";
import { Option } from "shared/types/professionalArea";
import { ProfessionalArea } from "shared/types/professionalArea";
import { ProfessionalAreaSelectProps } from "shared/types/professionalArea";


const ProfessionalAreaSelect: React.FC<ProfessionalAreaSelectProps> = ({
  value,
  onChange,
  options,
}) => {
  const [query, setQuery] = useState(value?.name || "");
  const [isFocused, setIsFocused] = useState(false);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    setQuery(option.name);
    onChange(option);
    setIsFocused(false);
  };

  useEffect(() => {
    if (!value) setQuery("");
    else setQuery(value.name);
  }, [value]);

  return (
    <div className={styles.form}>
      <label>Оказываемые услуги</label>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Например, Аналитик"
        />
        {isFocused && filteredOptions.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredOptions.map((opt) => (
              <li key={opt.id} onClick={() => handleSelect(opt)}>
                <strong>{opt.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfessionalAreaSelect;
