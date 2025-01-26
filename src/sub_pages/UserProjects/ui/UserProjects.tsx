import classes from './UserProjects.module.scss';
import { Input } from 'shared/index';
import { Button } from 'shared/index';
import search from 'shared/images/sideBarImgs/search.svg';
import status from 'shared/images/status.svg';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'shared/store';
import { useEffect, useState } from 'react';
import { getProjects } from 'shared/store/slices/projectsSlice';
import ModalsProjects from "../../../widgets/Modals/ModalsProjects/ModalsProjects";

export default function UserProjects() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModalColumn, setActiveModalColumn] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const dispatch = useDispatch<AppDispatch>();

    const getData = useSelector((state: any) => state.tasks.tasks);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                await dispatch(getProjects()).unwrap();
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [dispatch]);

    useEffect(() => {
        if (getData?.results) {
            const filtered = getData.results.filter((project: any) =>
                project.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
    }, [searchTerm, getData]);

    const handleOpenModal = (columnName: string) => {
        setActiveModalColumn(columnName);
        setIsModalOpen(true);
    };

    return (
        <main className={classes.main}>
            <div className={classes.search_and_filter}>
                <div className={classes.search}>
                    <div className={classes.input_wrapper}>
                        <Input
                            className={classes.input}
                            type="text"
                            placeholder="Поиск"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                        <img src={search} alt="Search Icon" className={classes.search_icon} />
                    </div>
                </div>
                <div className={classes.filter}>
                    <p>Сбросить фильтры</p>
                    <p>Сохранить комбинацию</p>
                </div>
            </div>

            <section className={classes.options}>
                <div className={classes.status}>
                    <p>Название проекта</p>
                    <img
                        onClick={() => handleOpenModal('project_name')}
                        src={status}
                        alt="Статус"
                    />
                </div>
                <div className={classes.status}>
                    <p>Статус</p>
                    <img
                        onClick={() => handleOpenModal('status')}
                        src={status}
                        alt="Статус"
                    />
                </div>
                <div className={classes.status}>
                    <p>Дата окончания</p>
                    <img
                        onClick={() => handleOpenModal('end_date')}
                        src={status}
                        alt="Статус"
                    />
                </div>
                <div className={classes.status}>
                    <p>Специалисты</p>
                    <img
                        onClick={() => handleOpenModal('specialists')}
                        src={status}
                        alt="Статус"
                    />
                </div>
                <div className={classes.status}>
                    <p>Заказчик</p>
                    <img
                        onClick={() => handleOpenModal('client')}
                        src={status}
                        alt="Статус"
                    />
                </div>
                <div className={classes.status}>
                    <p>Чаты проектов</p>
                </div>
            </section>

            <section className={classes.projects_list}>
                {filteredProjects && filteredProjects.length > 0 ? (
                    filteredProjects.map((project: any, index: number) => (
                        <div key={index} className={classes.project_card}>
                            <div className={classes.project_name}>
                                <p>{project.name || 'Без названия'}</p>
                            </div>
                            <div className={classes.project_captain}>
                                <p>{project.captain || 'Не назначен'}</p>
                            </div>
                            <div className={classes.project_end_date}>
                                <p>{project.end_date || 'Не указана'}</p>
                            </div>
                            <div className={classes.project_students}>
                                <p>{project.students || 'Нет студентов'}</p>
                            </div>
                            <div className={classes.project_duration}>
                                <p>{project.duration || 'Не указана'}</p>
                            </div>
                            <div className={classes.project_chat}>
                                <p>Чат</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={classes.project_card}>
                        <p>{getData ? 'Нет данных для отображения' : 'Загрузка данных...'}</p>
                    </div>
                )}
            </section>

            {isModalOpen && (
                <ModalsProjects
                    onClose={() => setIsModalOpen(false)}
                    Input={Input}
                    Button={Button}
                />
            )}
        </main>
    );
}
