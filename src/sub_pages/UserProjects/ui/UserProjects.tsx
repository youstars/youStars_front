import classes from './UserProjects.module.scss';
import { Input } from 'shared/index';
import search from 'shared/images/sideBarImgs/search.svg';
import status from 'shared/images/status.svg';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'shared/store';
import { useEffect } from 'react';
import { getProjects } from 'shared/store/slices/projectsSlice';

export default function UserProjects() {
    const dispatch = useDispatch<AppDispatch>();

    // Получение данных из Redux store
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

    // Логирование данных для проверки
    console.log('Redux data:', getData);

    return (
        <main className={classes.main}>
            {/* Поисковая строка и фильтры */}
            <div className={classes.search_an_filter}>
                <div className={classes.search}>
                    <div className={classes.input_wrapper}>
                        <Input className={classes.input} type="text" placeholder="Поиск" />
                        <img src={search} alt="Search Icon" className={classes.search_icon} />
                    </div>
                </div>
                <div className={classes.filter}>
                    <p>Сбросить фильтры</p>
                    <p>Сохранить комбинацию</p>
                </div>
            </div>

            {/* Заголовки колонок */}
            <section className={classes.options}>
                <div className={classes.status}>
                    <p>Название проекта</p>
                    <img src={status} alt="Статус" />
                </div>
                <div className={classes.status}>
                    <p>Статус</p>
                    <img src={status} alt="Статус" />
                </div>
                <div className={classes.status}>
                    <p>Дата окончания</p>
                    <img src={status} alt="Статус" />
                </div>
                <div className={classes.status}>
                    <p>Специалисты</p>
                    <img src={status} alt="Статус" />
                </div>
                <div className={classes.status}>
                    <p>Заказчик</p>
                    <img src={status} alt="Статус" />
                </div>
                <div className={classes.status}>
                    <p>Чаты проектов</p>
                </div>
            </section>

            {/* Список проектов */}
            <section className={classes.projects_list}>
                {getData && getData.results && getData.results.length > 0 ? (
                    getData.results.map((project: any, index: number) => (
                        <div key={index} className={classes.project_card}>
                            <div className={classes.project_name}>
                                <p>{ project.name || 'Без названия'}</p>
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
        </main>
    );
}
