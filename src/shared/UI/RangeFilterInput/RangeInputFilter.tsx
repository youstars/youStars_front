import styles from './RangeFilterInput.module.scss';

interface Props {
  label: string;
  value: { min: number; max: number };
  onChange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
}

const RangeFilterInput = ({ label, value, onChange }: Props) => {
  return (
    <>
      <h4>{label}</h4>
      <div className={styles.group}>
        <input
          type="number"
          min={0}
          placeholder="От"
          value={value.min === 0 ? "" : value.min}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              min: Number(e.target.value),
            }))
          }
          className={styles.input}
        />
        <input
          type="number"
          min={0}
          placeholder="До"
          value={value.max === Infinity ? "" : value.max}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              max: e.target.value === "" ? Infinity : Number(e.target.value),
            }))
          }
          className={styles.input}
        />
      </div>
    </>
  );
};

export default RangeFilterInput;
