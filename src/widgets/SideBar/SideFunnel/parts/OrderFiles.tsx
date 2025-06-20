import React from "react";
import classes from "../SideFunnel.module.scss"
import { Upload } from "lucide-react";

interface OrderFilesProps {
    termsOfReference?: string[] | null;
    commercialOffer?: string[] | null;
    other?: string[] | null;
}

const renderFiles = (label: string, files?: string[] | null) =>
    files && files.length
        ? files.map((_, idx) => (
            <li key={`${label}-${idx}`} className={classes.fileItem}>
                <span className={classes.fileIcon}>📎</span>
                {label}
            </li>
        ))
        : null;

const OrderFiles: React.FC<OrderFilesProps> = ({
                                                   termsOfReference,
                                                   commercialOffer,
                                                   other,
                                               }) => {
    const hasFiles =
        (termsOfReference?.length ?? 0) +
        (commercialOffer?.length ?? 0) +
        (other?.length ?? 0) >
        0;

    return (
        <div className={classes.uploadWrapper}>
            <div className={classes.uploadHeader}>
                <p>Файлы заявки</p>
                <div className={classes.uploadIcon}>
                    <Upload size={16} className={classes.icon} />
                </div>
            </div>

            <div className={classes.uploadBody}>
                <ul className={classes.fileList}>
                    {renderFiles("ТЗ", termsOfReference)}
                    {renderFiles("КП", commercialOffer)}
                    {renderFiles("Договор", other)}
                    {!hasFiles && <li className={classes.fileItem}>Нет файлов</li>}
                </ul>
            </div>
        </div>
    );
};

export default OrderFiles;