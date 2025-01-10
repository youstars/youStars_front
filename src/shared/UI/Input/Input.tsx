import React, { FC, ChangeEvent } from 'react';

interface InputProps {
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type: string;
    className?: string;
    required?: boolean;
    value?: string; // Добавлено для поддержки управления значением
    name?: string; // Добавлено свойство name
}

const Input: FC<InputProps> = ({ type, className, ...rest }) => {
    return (
        <input
            type={type}
            className={className}
            {...rest} // Передаём остальные пропсы в <input>
        />
    );
};

export default Input;
