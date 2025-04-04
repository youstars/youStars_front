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
            <h3 className={styles.trackerNotes__title}>Заметки трекеров</h3>

            <div className={styles.trackerNotes__list}>
                {notes.map((note) => (
                    <div key={note.id} className={styles.trackerNotes__item}>
                        {/* Контейнер с аватаром и автором */}
                        <div className={styles.trackerNotes__user}>
                            <div className={styles.trackerNotes__avatar}></div>
                            <span className={styles.trackerNotes__author}>{note.author}</span>
                        </div>

                        {/* Контейнер с текстом и датой */}
                        <div className={styles.trackerNotes__content}>
                            <div className={styles.trackerNotes__text}>{note.text}</div>
                            <span className={styles.trackerNotes__date}>{note.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className={styles.trackerNotes__add}>
            <img
                src={Plus}
                alt="Plus"
              />  Добавить комментарий
            </button>
        </div>
    );
};
