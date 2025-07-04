import React, { useState, useEffect, useRef } from 'react';
import styles from './EditableField.module.scss';

export type EditableFieldType = 'text' | 'number' | 'date' | 'textarea';

interface EditableFieldProps<T> {
    /** Текущее значение поля */
    value: T;
    /** Функция, вызываемая при сохранении нового значения */
    onSave: (newValue: T) => Promise<void> | void;
    /** Можно ли включать режим редактирования (по клику) */
    canEdit?: boolean;
    /** Тип поля (input или textarea) */
    type?: EditableFieldType;
    /** Плейсхолдер для поля ввода */
    placeholder?: string;
    /** Форматтер для отображения (например, для валюты или дат) */
    displayFormatter?: (value: T) => React.ReactNode;
}

function EditableField<T extends string | number>({
                                                      value,
                                                      onSave,
                                                      canEdit = true,
                                                      type = 'text',
                                                      placeholder,
                                                      displayFormatter,
                                                  }: EditableFieldProps<T>) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingValue, setEditingValue] = useState<T>(value);
    const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

    // Обновляем локальное значение, если props.value изменился
    useEffect(() => {
        setEditingValue(value);
    }, [value]);

    // Фокус на поле при входе в режим редактирования
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // для textarea можно вызывать авто-растяжку, если нужно
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (editingValue !== value) {
            await onSave(editingValue);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditingValue(value);
        setIsEditing(false);
    };

    return (
        <div className={styles.editableField}>
            {isEditing ? (
                <>
                    {type === 'textarea' ? (
                        <textarea
                            ref={inputRef}
                            className={styles.input}
                            value={editingValue as any}
                            placeholder={placeholder}
                            onChange={(e) => setEditingValue(e.target.value as any)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') handleCancel();
                            }}
                        />
                    ) : (
                        <input
                            ref={inputRef}
                            className={styles.input}
                            type={type}
                            value={editingValue as any}
                            placeholder={placeholder}
                            onChange={(e) => {
                                if (type === 'number') {
                                    setEditingValue((e.target.valueAsNumber as any));
                                } else {
                                    setEditingValue((e.target.value as any));
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                            }}
                        />
                    )}
                    <div className={styles.controls}>
                        <button
                            type="button"
                            className={styles.saveButton}
                            onClick={handleSave}
                        >
                            Сохранить
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleCancel}
                        >
                            Отменить
                        </button>
                    </div>
                </>
            ) : (
                <div className={styles.display}>
          <span
              className={canEdit ? styles.clickable : styles.value}
              onClick={() => canEdit && setIsEditing(true)}
          >
            {displayFormatter
                ? displayFormatter(value)
                : value?.toString() || '—'}
          </span>
                </div>
            )}
        </div>
    );
}

export default EditableField;