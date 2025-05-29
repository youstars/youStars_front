import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getCookie } from "shared/utils/cookies";
import { Project } from
  "widgets/sub_pages/ClientProfile/components/ProjectBlock/ProjectBlock";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface SpecialistFile {
    name: string;
    file: string;
    description?: string;
    specialist?: number;
  }

export interface Client {
  id: number;
  custom_user: {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    username: string;
    time_zone: string;
    email: string;
    avatar: string | null;
    phone_number: string | null;
    role: string;
    tg_nickname?: string | null;
   
  };
 file?: SpecialistFile[]; 
  business_name?: string | null;
  position?: string | null;


  description?: string | null;
  problems?: string | null;
  tasks?: string | null;
  business_goals?: string | null;
  solving_problems?: string | null;
  target_audience?: string | null;

  geography?: string | null;
  employee_count?: string | null;
  revenue?: string | null;
  years_on_market?: string | null;

  professional_areas?: number[];        
  business_scope_ids?: number[];       

  overall_rating?: number | null;
  mood?: number | null;

  /* метрики заказов */
  orders_total?: number;
  orders_in_progress?: number;
  order_cost_avg?: number;
  projects_count?: number;
  projects?: Project[];  
}




interface ClientState {
  data: Client | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  data: null,
  loading: false,
  error: null,
};


export const getClientById = createAsyncThunk<Client, number>(
  "client/getClientById",
  async (id, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axios.get(
        `${API_BASE_URL}users/client/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка при получении клиента по ID"
      );
    }
  }
);



// clientSlice.ts
export const updateClient = createAsyncThunk<Client, { id?: number, data: any }>(
  "client/updateClient",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");

      const url = id
        ? `${API_BASE_URL}users/client/${id}/`   // путь для админа
        : `${API_BASE_URL}users/clients/me/`;    // путь для клиента

      const response = await axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Ошибка при обновлении клиента");
    }
  }
);



const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientById.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
     
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
  console.log("payload из updateClient:", action.payload.position); // <- должно быть "boss"
  state.data = action.payload;            // ← обновляем store
})
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default clientSlice.reducer;
