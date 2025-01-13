import classes from './TaskPage.module.scss'
import {useEffect} from "react";
import {getTasks} from "shared/store/slices/tasksSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "shared/store";


const TaskPage = () => {
    const dispatch = useDispatch<AppDispatch>()
// @ts-ignore
    const getData = useSelector(state => state.tasks.tasks)
    console.log(getData.results)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const result = await dispatch(getTasks()).unwrap();
                console.log("Tasks data:", result.results);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [dispatch]);


    return (
        <div>
            <h2>
                {getData.results.map((el:any) => (
                    <li key={el.id}>{el.description}</li>
                )) || <p>No data available</p>}
            </h2>
        </div>
    );
};

export default TaskPage;
