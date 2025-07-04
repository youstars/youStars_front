import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    createEntityAdapter,
} from "@reduxjs/toolkit";
import {ProjectDetail, ProjectSummary} from "shared/types/project";
import {getCookie} from "shared/utils/cookies";
import axiosInstance from "shared/api/api";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ─────────────────────────────────── enums
export enum FetchStatus {
    Idle = "idle",
    Pending = "pending",
    Fulfilled = "fulfilled",
    Rejected = "rejected",
}

// ─────────────────────────────────── adapter
const projectsAdapter = createEntityAdapter<ProjectSummary>({
    sortComparer: (a, b) => (a.id > b.id ? 1 : -1),
});

type ProjectsEntityState = ReturnType<typeof projectsAdapter.getInitialState>;

interface ProjectsState extends ProjectsEntityState {
    current: ProjectDetail | null;
    status: FetchStatus;
    error: string | null;
}

const initialState: ProjectsState = {
    ...projectsAdapter.getInitialState(),
    current: null,
    status: FetchStatus.Idle,
    error: null,
};


export const getProjects = createAsyncThunk<
    ProjectSummary[],
    void,
    { state: { projects: ProjectsState } }
>(
    "projects/getProjects",
    async (_, {rejectWithValue}) => {
        try {
            // const token = getCookie("access_token");
            const role = getCookie("user_role");
            let url = `${API_BASE_URL}projects/`;
            if (role && role.toLowerCase().includes("client")) {
                const clientId = getCookie("user_role_id");
                if (!clientId) {
                    return rejectWithValue("Client id not found in cookies");
                }
                url = `${API_BASE_URL}client/${clientId}/projects`;
            } else if (role && role.toLowerCase().includes("specialist")) {
                const specialistId = getCookie("user_role_id"); // cookie stores the current specialist.id
                if (!specialistId) {
                    return rejectWithValue("Specialist id not found in cookies");
                }
                url = `${API_BASE_URL}specialist/${specialistId}/projects`;
            }

            const response = await axiosInstance.get(url);
            const data = response.data;
            return Array.isArray(data) ? data : data.results;
        } catch (error: any) {
            console.error("Error fetching projects:", error);
            return rejectWithValue(error.response?.data || "Произошла ошибка");
        }
    }
    ,
    {
        condition: (_, {getState}) => {
            const {projects} = getState();
            return (
                projects.status === FetchStatus.Idle ||
                projects.status === FetchStatus.Rejected
            );
        },
    }
);


export const getProjectById = createAsyncThunk(
    "projects/getById",
    async (id: string | number, {rejectWithValue}) => {
        try {
            // const token = getCookie("access_token");
            const response = await axiosInstance.get(`${API_BASE_URL}project/${id}`);
            return response.data as ProjectDetail;
        } catch (err: any) {
            return rejectWithValue("Ошибка загрузки проекта");
        }
    }
);

export const updateProjectStatus = createAsyncThunk(
    "project/updateStatus",
    async ({id, status}: { id: number; status: string }, thunkAPI) => {
        try {
            // const token = getCookie("access_token");
            const response = await axiosInstance.patch(
                `${API_BASE_URL}project/${id}/`,
                { status }
            );
            return response.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue("Ошибка обновления статуса");
        }
    }
);

export const updateProject = createAsyncThunk(
    "project/updateProject",
    async (
        {id, updates}: { id: number; updates: Partial<ProjectDetail> },
        thunkAPI
    ) => {
        try {
            // const token = getCookie("access_token");
            const response = await axiosInstance.patch(
                `${API_BASE_URL}project/${id}/`,
                updates
            );
            return response.data as ProjectDetail;
        } catch (err: any) {
            return thunkAPI.rejectWithValue("Ошибка при обновлении проекта");
        }
    }
);

const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProjects.pending, (state) => {
                state.status = FetchStatus.Pending;
                state.error = null;
            })
            .addCase(
                getProjects.fulfilled,
                (state, action: PayloadAction<ProjectSummary[]>) => {
                    state.status = FetchStatus.Fulfilled;
                    projectsAdapter.setAll(state, action.payload);
                }
            )
            .addCase(getProjects.rejected, (state, action) => {
                state.status = FetchStatus.Rejected;
                state.error = action.payload as string;
            })
            .addCase(
                updateProject.fulfilled,
                (state, action: PayloadAction<ProjectDetail>) => {
                    state.current = action.payload;
                }
            )
            .addCase(updateProject.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            .addCase(getProjectById.pending, (state) => {
                state.status = FetchStatus.Pending;
                state.error = null;
            })
            .addCase(
                getProjectById.fulfilled,
                (state, action: PayloadAction<ProjectDetail>) => {
                    state.status = FetchStatus.Fulfilled;
                    state.current = action.payload;
                }
            )
            .addCase(getProjectById.rejected, (state, action) => {
                state.status = FetchStatus.Rejected;
                state.error = action.payload as string;
            });
    },
});

// ─────────────────────────────────── selectors
const projectsSelectors = projectsAdapter.getSelectors(
    (state: { projects: ProjectsState }) => state.projects
);


export const selectProjects = (state: { projects: ProjectsState }) =>
    projectsSelectors.selectAll(state);
export const selectCurrentProject = (state: { projects: ProjectsState }) =>
    state.projects.current;
export const selectProjectsStatus = (state: { projects: ProjectsState }) =>
    state.projects.status;
export const selectProjectsError = (state: { projects: ProjectsState }) =>
    state.projects.error;

export default projectsSlice.reducer;
