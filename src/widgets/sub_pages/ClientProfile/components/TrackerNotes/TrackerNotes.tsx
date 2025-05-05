import React from "react";
import styles from "./TrackerNotes.module.scss";
import Plus from "shared/images/clientImgs/Plus.svg";

export const TrackerNotes = (): JSX.Element => {
    const notes = [
        {
            id: 1,
            author: "Иванов Иван",
            date: "20.03.2025",
            text: "Текст заметки 1"
        },
        {
            id: 2,
            author: "Петров Петр",
            date: "21.03.2025",
            text: "Текст заметки 2"
        }
    ];

    return (
        <div className={styles.trackerNotes}>
            <h3 className={styles.trackerNotesTitle}>Заметки трекеров</h3>

            <div className={styles.trackerNotesList}>
                {notes.map((note) => (
                    <div key={note.id} className={styles.trackerNotesItem}>
                 
                        <div className={styles.trackerNotesUser}>
                            <div className={styles.trackerNotesAvatar}></div>
                            <span className={styles.trackerNotesAuthor}>{note.author}</span>
                        </div>

                    
                        <div className={styles.trackerNotesContent}>
                            <div className={styles.trackerNotesText}>{note.text}</div>
                            <span className={styles.trackerNotesDate}>{note.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className={styles.trackerNotesAdd}>
                <img src={Plus} alt="Plus" /> Добавить комментарий
            </button>
        </div>
    );
};
