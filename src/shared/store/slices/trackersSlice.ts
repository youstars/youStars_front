import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'shared/api/api';
import { getToken } from 'shared/utils/cookies';
import { Specialist } from 'shared/types/specialist'; 
import { RootState } from 'shared/store';

const API_ENDPOINT = '/users/admins/';

export const fetchTrackers = createAsyncThunk<Specialist[], void, { rejectValue: string }>(
  'trackers/fetchTrackers',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Токен отсутствует');

      const response = await axiosInstance.get(API_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.results || response.data;
    } catch (error: any) {
      console.error('Ошибка загрузки трекеров:', error);
      return rejectWithValue(error.response?.data || 'Не удалось загрузить трекеров');
    }
  }
);

interface TrackersState {
  list: Specialist[];
  loading: boolean;
  error: string | null;
}

const initialState: TrackersState = {
  list: [],
  loading: false,
  error: null,
};

const trackersSlice = createSlice({
  name: 'trackers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrackers.fulfilled, (state, action: PayloadAction<Specialist[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTrackers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки';
      });
  },
});

export const selectTrackers = (state: RootState) => state.trackers.list;
export const selectTrackersLoading = (state: RootState) => state.trackers.loading;
export const selectTrackersError = (state: RootState) => state.trackers.error;

export default trackersSlice.reducer;
