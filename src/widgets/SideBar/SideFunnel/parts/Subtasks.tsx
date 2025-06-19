import React, { useState } from "react";
import classes from "../SideFunnel.module.scss"
import { CheckSquare, PlusSquare } from "lucide-react";

interface Props {
    onAddSubtask: (text: string) => void;
}

const Subtasks: React.FC<Props> = ({ onAddSubtask }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [input, setInput] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim()) {
            onAddSubtask(input.trim());
            setInput("");
        }
    };

    return (
        <div className={classes.subtasksWrapper}>
            <div
                className={classes.subtasksHeader}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <h3>Подзадачи</h3>
                <span className={`${classes.arrow} ${isOpen ? classes.up : ""}`} />
            </div>

            {isOpen && (
                <div className={classes.subtasksContent}>
                    <div className={classes.check_block}>
                        <div className={classes.subtaskForm}>
                            <input
                                type="text"
                                placeholder="Новая подзадача"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={classes.subtaskInput}
                            />
                        </div>

                        <CheckSquare size={14} className={classes.icon} />
                        <p>Прислать счёт об оплате</p>
                    </div>

                    <div className={classes.plus_block}>
                        <PlusSquare size={14} className={classes.icon} />
                        <p>Новая задача</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subtasks;