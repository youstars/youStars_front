import styles from "../ClientProfile.module.scss";

interface BusinessInfoProps {
    edit: boolean;
    form: {
        description: string;
        problems: string;
        tasks: string;
    };
    onChange: (
        field: "description" | "problems" | "tasks"
    ) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    client: {
        description?: string;
        problems?: string;
        tasks?: string;
    };
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({
                                                       edit,
                                                       form,
                                                       onChange,
                                                       client,
                                                   }) => (
    <div className={styles.businessInfo}>
        <div className={styles.businessBlock}>
            <h4 className={styles.businessTitle}>Описание бизнеса</h4>
            {edit ? (
                <textarea
                    className={styles.inputFieldBottom}
                    value={form.description}
                    onChange={onChange("description")}
                />
            ) : (
                <p className={styles.businessEmpty}>
                    {client.description || "Описание не указано"}
                </p>
            )}
        </div>

        <div className={styles.businessBlock}>
            <h4 className={styles.businessTitle}>Проблемы бизнеса</h4>
            {edit ? (
                <textarea
                    className={styles.inputFieldBottom}
                    value={form.problems}
                    onChange={onChange("problems")}
                />
            ) : (
                <p className={styles.businessEmpty}>
                    {client.problems || "Не указано"}
                </p>
            )}
        </div>

        <div className={styles.businessBlock}>
            <h4 className={styles.businessTitle}>Задачи бизнеса</h4>
            {edit ? (
                <textarea
                    className={styles.inputFieldBottom}
                    value={form.tasks}
                    onChange={onChange("tasks")}
                />
            ) : (
                <p className={styles.businessEmpty}>
                    {client.tasks || "Не указано"}
                </p>
            )}
        </div>
    </div>
);

export default BusinessInfo;