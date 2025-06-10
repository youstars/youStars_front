import React, { FC, ChangeEvent } from 'react';

interface InputProps {
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type: string;
    className?: string;
    required?: boolean;
    value?: string; 
    name?: string; 
}

const Input: FC<InputProps> = ({ type, className, ...rest }) => {
    return (
        <input
            type={type}
            className={className}
            {...rest} 
        />
    );
};

export default Input;
