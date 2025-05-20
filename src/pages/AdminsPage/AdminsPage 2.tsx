import classes from './AdminsPage.module.scss'
import {Button, Input} from "shared/index";
import search from "../../shared/images/sideBarImgs/search.svg";
import filters from "../../shared/images/filters.svg";
import star from "../../shared/images/star.svg";
import {useDispatch, useSelector} from "react-redux";
import {getTasks} from "shared/store/slices/tasksSlice";
import {useEffect, useState} from "react";
import filter from "../../shared/images/filter.svg";
import messageAdmin from "../../shared/images/messageAdmin.svg";
import {useNavigate} from "react-router-dom";

const AdminsPage = () => {
    const dispatch = useDispatch();
    const getData = useSelector((state: any) => state.tasks.tasks);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const navigate = useNavigate();


    const handleCheckboxChange = (value: string) => {
        setSelectedFilters(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const handleResetFilters = () => {
        setSelectedFilters([]);
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(getTasks());
    }, [dispatch]);

    const filteredClients = getData.results?.filter((item: any) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const navigateForm  = (path:string) : any  => {
        navigate(path);
    }

    return (
        <div className={classes.wrapper}>
            <main className={`${classes.main} ${isSidebarOpen ? classes.shifted : ''}`}>
                <form className={classes.form}>
                    <div className={classes.search_and_filter}>
                        <div className={classes.input_wrapper}>
                            <Input
                                className={classes.input}
                                type="text"
                                placeholder="Поиск клиента"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setSearchTerm(e.target.value)
                                }
                            />
                            <img src={search} alt="Search Icon" className={classes.search_icon}/>
                        </div>
                    </div>

                    <div className={classes.filters} onClick={() => setIsSidebarOpen(prev => !prev)}>
                        <img src={filters} alt=""/>
                        <p>Последнее взаимодействие возрастание</p>
                    </div>
                </form>

                <div className={classes.sum_clients}>
                    <p> Найдено {filteredClients.length} трекеров:</p>
                </div>

                {filteredClients.map((item: any) => (
                    <div key={item.id || item.title} className={classes.all_blocks}>
                        <div className={classes.img_job_title}>
                            <div className={classes.img}/>
                            <div className={classes.content}>
                                <p>{item.title}</p>
                                <h3>{item.assigned_specialist}</h3>
                            </div>
                            <div
                                className={classes.send_message}
                                onClick={() => navigate('/manager/auth_admin')}
                            >
                                <img src={messageAdmin} alt="Регистрация админа"/>
                            </div>
                        </div>

                        <p className={classes.description}>{item.material}</p>

                        <div className={classes.payment_block}>
                        <div className={classes.payment_text}>
                                <p>Стоимость <span>{item.project_cost}</span></p>
                                <p>Средняя стоимость <span>{item.project_cost / 2}</span></p>
                                <p>Настроение <span>{item.status}</span>.3 / 1</p>
                            </div>

                            <div className={classes.payment_text}>
                                <p>Активные проекты <span>{item.status}</span></p>
                                <p>Все проекты <span>{item.id}</span></p>
                                <p>Дата последнего контакта <span>{item.start_date}</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <div className={isSidebarOpen ? classes.sidebar : `${classes.sidebar} ${classes.closed}`}>
                <div className={classes.header_filter}>
                    <img src={filter} alt=""/>
                    <p>Фильтр</p>
                </div>


                <div className={classes.scope_block}>
                    <p className={classes.scope_title}>Сфера деятельности</p>
                    <ul className={classes.checkboxList}>
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={selectedFilters.includes("design")}
                                    onChange={() => handleCheckboxChange("design")}
                                />
                                <span className={classes.customCheckbox}></span>
                                Дизайн
                            </label>
                            <ul className={classes.subList}>
                                {["graphic", "uxui", "animation", "other"].map(key => (
                                    <li key={key}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                hidden
                                                checked={selectedFilters.includes(key)}
                                                onChange={() => handleCheckboxChange(key)}
                                            />
                                            <span className={classes.customCheckbox}></span>
                                            {{
                                                graphic: "Графический дизайн",
                                                uxui: "UX / UI",
                                                animation: "2D / 3D Анимация",
                                                other: "Другое",
                                            }[key]}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={selectedFilters.includes("programming")}
                                    onChange={() => handleCheckboxChange("programming")}
                                />
                                <span className={classes.customCheckbox}></span>
                                Программирование
                            </label>
                        </li>

                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={selectedFilters.includes("it")}
                                    onChange={() => handleCheckboxChange("it")}
                                />
                                <span className={classes.customCheckbox}></span>
                                IT
                            </label>
                        </li>
                    </ul>
                </div>

                <div className={classes.block_more}>
                    <div className={classes.moreToggle} onClick={() => setIsMoreOpen(prev => !prev)}>
                        <p>Больше</p>
                        <span className={`${classes.arrow} ${isMoreOpen ? classes.up : classes.down}`}/>
                    </div>

                    {isMoreOpen && (
                        <div className={classes.moreContent}>
                            <label>
                                Только с активными проектами
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={selectedFilters.includes("active")}
                                    onChange={() => handleCheckboxChange("active")}
                                />
                                <span className={classes.customCheckbox}></span>
                            </label>

                            <h4>Проблемы бизнеса</h4>
                            {["problem1", "problem2", "problem3"].map(key => (
                                <label key={key}>
                                    <input
                                        type="checkbox"
                                        hidden
                                        checked={selectedFilters.includes(key)}
                                        onChange={() => handleCheckboxChange(key)}
                                    />
                                    <span className={classes.customCheckbox}></span> Проблема
                                </label>
                            ))}

                            <h4>Задачи бизнеса</h4>
                            {["task1", "task2", "task3"].map(key => (
                                <label key={key}>
                                    <input
                                        type="checkbox"
                                        hidden
                                        checked={selectedFilters.includes(key)}
                                        onChange={() => handleCheckboxChange(key)}
                                    />
                                    <span className={classes.customCheckbox}></span> Задача
                                </label>
                            ))}

                            <h4>Дата последнего контакта</h4>
                            {["less1", "1to2", "more3"].map(key => (
                                <label key={key}>
                                    <input
                                        type="checkbox"
                                        hidden
                                        checked={selectedFilters.includes(key)}
                                        onChange={() => handleCheckboxChange(key)}
                                    />
                                    <span className={classes.customCheckbox}></span>
                                    {{
                                        less1: "Менее дня",
                                        "1to2": "1-2 дня",
                                        more3: "Более 3 дней",
                                    }[key]}
                                </label>
                            ))}

                            <h4>Наличие отзывов</h4>
                            {["hasReviews", "noReviews"].map(key => (
                                <label key={key}>
                                    <input
                                        type="checkbox"
                                        hidden
                                        checked={selectedFilters.includes(key)}
                                        onChange={() => handleCheckboxChange(key)}
                                    />
                                    <span className={classes.customCheckbox}></span>
                                    {key === "hasReviews" ? "Есть отзывы" : "Нет отзывов"}
                                </label>
                            ))}

                            <div className={classes.buttonBlock}>
                                <button className={classes.applyBtn}>Применить</button>
                                <button onClick={handleResetFilters} className={classes.resetBtn}>
                                    Сбросить все
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminsPage;
