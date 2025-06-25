import { useState } from "react";
import styles from "widgets/sub_pages/SpecialistProfile/sections/Other/EducationForm/EducationForm.module.scss";
import { ProfessionalServiceSelectProps } from "shared/types/professionalArea";

const ProfessionalServiceSelect: React.FC<ProfessionalServiceSelectProps> = ({
  areas,
  onSelect,
  selectedService,
}) => {
  const [openAreaId, setOpenAreaId] = useState<number | null>(null);

  return (
    <div className={styles.form}>
      <label className={styles.label}>Оказываемая услуга</label>
      <div className={styles.inputWrapper}>
        <ul className={styles.dropdown}>
          {areas?.map((area) => (
            <li key={area.id}>
              <div
                className={styles.areaItem}
                onClick={() =>
                  setOpenAreaId((prev) => (prev === area.id ? null : area.id))
                }
              >
                <strong>{area.name}</strong>
              </div>
              {openAreaId === area.id && area.professions?.map((profession) => (
                <ul key={profession.id} className={styles.subDropdown}>
                  {profession.services?.map((service) => (
                    <li
                      key={service.id}
                      className={styles.serviceItem}
                      onClick={() => {
                        onSelect(service);
                        setOpenAreaId(null); // Закрыть после выбора
                      }}
                    >
                      {service.name}
                    </li>
                  ))}
                </ul>
              ))}
            </li>
          ))}
        </ul>
        {selectedService && (
          <div className={styles.selected}>
            Выбрано: <strong>{selectedService.name}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalServiceSelect;
