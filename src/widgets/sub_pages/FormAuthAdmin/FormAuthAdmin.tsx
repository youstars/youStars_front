import React from 'react';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; import * as yup from 'yup';
import styles from './FormAuthAdmin.module.scss';

interface IFormInputs {
    fullName: string;
    email: string;
    login: string;
    password: string;
    confirmPassword: string;
    role: string;
}

const schema: yup.ObjectSchema<IFormInputs> = yup
    .object({
        fullName: yup.string().required('ФИО обязательно'),
        email: yup.string().email('Неверный формат email').required('Email обязателен'),
        login: yup.string().required('Логин обязателен'),
        password: yup
            .string()
            .min(6, 'Пароль должен быть не менее 6 символов')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Пароль должен содержать специальный символ')
            .required('Пароль обязателен'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Пароли должны совпадать')
            .required('Подтверждение пароля обязательно'),
        role: yup
            .string()
            .oneOf(['treker', 'admin'], 'Выберите роль')
            .required('Роль обязательна'),
    })
    .defined();

const resolver: Resolver<IFormInputs> = yupResolver(schema) as unknown as Resolver<IFormInputs>;

const FormAuthAdmin: React.FC = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IFormInputs>({
        resolver,
        mode: 'onChange',
    });

    const onSubmit: SubmitHandler<IFormInputs> = (data:any) => {
        const payload = {
            full_name: data.fullName,
            email: data.email,
            username: data.login,
            password: data.password,
            re_password: data.confirmPassword,
        };
        console.log('Payload:', payload);
        reset();
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <h2>Создание трекера</h2>
                            <div className={styles.status}>
                                <span className={styles.dot}></span>
                                <p>Запросить для регистрации</p>
                            </div>
                        </div>

                        <div className={styles.formFields}>
                            <div className={styles.inputGroup}>
                                <div className={styles.label_title}>
                                    <p className={styles.span}/>
                                    <label>ФИО</label>
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="ФИО"
                                        {...register('fullName')}
                                        className={errors.fullName ? styles.errorInput : ''}
                                    />
                                </div>
                                {errors.fullName && <p className={styles.error}>{errors.fullName.message}</p>}
                            </div>

                            <div className={styles.inputGroup}>
                                <div className={styles.label_title}>
                                    <p className={styles.span}/>
                                    <label>Email</label>
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        {...register('email')}
                                        className={errors.email ? styles.errorInput : ''}
                                    />
                                </div>
                                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                            </div>

                            <div className={styles.inputGroup}>
                                <div className={styles.label_title}>
                                    <p className={styles.span}/>
                                    <label>Логин</label>
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="Логин"
                                        {...register('login')}
                                        className={errors.login ? styles.errorInput : ''}
                                    />
                                </div>
                                {errors.login && <p className={styles.error}>{errors.login.message}</p>}
                            </div>

                            <div className={styles.inputGroup}>
                                <div className={styles.label_title}>
                                    <p className={styles.span}/>
                                    <label>Пароль</label>
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="password"
                                        placeholder="Пароль"
                                        {...register('password')}
                                        className={errors.password ? styles.errorInput : ''}
                                    />
                                </div>
                                {errors.password && <p className={styles.error}>{errors.password.message}</p>}
                                {/*<p className={styles.hint}>*/}
                                {/*    Пароль должен содержать более 6 символов + специальный символ*/}
                                {/*</p>*/}
                            </div>

                            <div className={styles.inputGroup}>
                                <div className={styles.label_title}>
                                    <p className={styles.span}/>
                                    <label>Подтвердите пароль</label>
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="password"
                                        placeholder="Пароль"
                                        {...register('confirmPassword')}
                                        className={errors.confirmPassword ? styles.errorInput : ''}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className={styles.error}>{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Выберите роль</label>
                                <div className={styles.radioGroup}>
                                    <label>
                                        <input type="radio" value="treker" {...register('role')} />
                                        Трекер
                                    </label>
                                    <label>
                                        <input type="radio" value="admin" {...register('role')} />
                                        Админ
                                    </label>
                                </div>
                                {errors.role && <p className={styles.error}>{errors.role.message}</p>}
                            </div>
                        </div>

                        <div className={styles.buttons}>
                            <button type="submit" className={styles.submitButton}>
                                Создать
                            </button>
                            <button type="button" className={styles.saveButton}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormAuthAdmin;
