import React, {useState} from "react";
import classes from "./SubTasks.module.scss";
import {CheckSquare, PlusSquare} from "lucide-react";
import {useAppSelector} from "shared/hooks/useAppSelector";
import {useAppDispatch} from "shared/hooks/useAppDispatch";
import {createSubtask, selectSubtasks} from "shared/store/slices/subtaskSlice";

interface Props {
    orderId: number | string;
    onAddSubtask: (text: string) => void;
}

const SubTasks: React.FC<Props> = ({onAddSubtask, orderId}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [inputVisible, setInputVisible] = useState(false);
    const [input, setInput] = useState("");

    const subtasks = useAppSelector(selectSubtasks);
    const dispatch = useAppDispatch();

    const handleAdd = () => {
        const content = input.trim();
        if (!content) return;

        // Приводим orderId к числу
        dispatch(createSubtask({content, order: Number(orderId)}));
        onAddSubtask(content); // если вдруг тебе нужен колбэк
        setInput("");
        setInputVisible(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    };

    return (
        <div className={classes.subtasksWrapper}>
            <div className={classes.subtasksHeader} onClick={() => setIsOpen(!isOpen)}>
                <h3>Подзадачи</h3>
                <span className={`${classes.arrow} ${isOpen ? classes.up : ""}`}/>
            </div>

            {isOpen && (
                <div className={classes.subtasksContent}>
                    {subtasks.map((task) => (
                        <div key={task.id} className={classes.check_block}>
                            <CheckSquare size={14} className={classes.icon}/>
                            <p>{task.content}</p>
                        </div>
                    ))}

                    {inputVisible ? (
                        <div className={classes.subtaskForm}>
                            <input
                                type="text"
                                placeholder="Новая подзадача"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() => {
                                    if (!input.trim()) setInputVisible(false);
                                }}
                                className={classes.subtaskInput}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className={classes.plus_block} onClick={() => setInputVisible(true)}>
                            <PlusSquare size={14} className={classes.icon}/>
                            <p>Новая задача</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubTasks;
