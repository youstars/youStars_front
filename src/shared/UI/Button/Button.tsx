import React, { FC, ButtonHTMLAttributes } from 'react';
import classes from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	type?: 'button' | 'submit' | 'reset';
}

const Button: FC<ButtonProps> = ({ children, className, type = 'button', ...props }) => {
	return (
		<button
			{...props}
			className={`${classes.myBtn} ${className || ''}`.trim()}
			type={type}
		>
			{children}
		</button>
	);
};

export default Button;
