import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";


const API_BASE_URL = "http://127.0.0.1:8000/ru/";

// @ts-ignore
export const getTasks = createAsyncThunk<any,void>(
    'tasks/getTasks',
    async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}taskstudents`);
        console.log( 'get data ' + response.data)
    return response.data;
    }
)




// @ts-ignore
const tasksSlice = createSlice({
    name:'tasks',
    initialState: {}
})

export default tasksSlice.reducer;
