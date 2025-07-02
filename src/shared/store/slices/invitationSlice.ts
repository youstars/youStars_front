import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "shared/store";
import { API_INVITATIONS } from "shared/api/endpoints";
import { getCookie } from "shared/utils/cookies";

export interface InvitationPayload {
  order: number;
  specialist_id: number;
  tracker_id: number;
  proposed_payment: number;
}

export interface InvitationDetails {
  specialist_name: string;
  tracker_name: string;
  proposed_payment: number;
  project_name: string;
  order_goal: string;
}

interface InvitationState {
  payload: InvitationPayload | null;
  details: InvitationDetails | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

const initialState: InvitationState = {
  payload: null,
  details: null,
  status: "idle",
  error: null,
};

export const sendInvitation = createAsyncThunk(
  "invitations/send",
  async (payload: InvitationPayload) => {
    const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";
    const token = getCookie("access_token") || "";

    const res = await fetch(`${baseUrl}/${API_INVITATIONS.create}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Не удалось отправить приглашение");
    }

    return await res.json();
  }
);
export const respondToInvitation = createAsyncThunk(
  "invitations/respond",
  async ({ id, status }: { id: number; status: "ACCEPTED" | "DECLINED" }) => {
    const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";
    const token = getCookie("access_token") || "";

    const res = await fetch(
      `${baseUrl}/users/manage-invitations/${id}/respond/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      throw new Error("Ошибка отправки ответа на приглашение");
    }

    return await res.json();
  }
);

export const approveInvitation = createAsyncThunk(
  "invitations/approve",
  async (id: number) => {
    const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";
    const token = getCookie("access_token") || "";

    const res = await fetch(
      `${baseUrl}/users/manage-invitations/${id}/approve/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_approved: true }),
      }
    );

    if (!res.ok) {
      throw new Error("Не удалось подтвердить приглашение");
    }

    return await res.json();
  }
);

export const rejectInvitation = createAsyncThunk(
  "invitations/reject",
  async (invitationId: number) => {
    const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";
    const token = getCookie("access_token") || "";

    const res = await fetch(
      `${baseUrl}/users/manage-invitations/${invitationId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Не удалось удалить приглашение");
    }

    return invitationId;
  }
);

export const updateInvitationPayment = createAsyncThunk<
  InvitationPayload,
  { invitationId: number; proposedPayment: number },
  { rejectValue: string }
>(
  "invitations/updatePayment",
  async ({ invitationId, proposedPayment }, { rejectWithValue }) => {
    const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";
    const token = getCookie("access_token") || "";
    try {
      const res = await fetch(
        `${baseUrl}/users/manage-invitations/${invitationId}/update_payment/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ proposed_payment: proposedPayment }),
        }
      );
      if (!res.ok) {
        return rejectWithValue("Не удалось обновить сумму предложения");
      }
      return (await res.json()) as InvitationPayload;
    } catch (error: any) {
      console.error("Ошибка при обновлении суммы предложения:", error);
      return rejectWithValue(error.message || "Ошибка при обновлении суммы");
    }
  }
);

export const getInvitationDetails = createAsyncThunk<
  InvitationDetails,
  number,
  { rejectValue: string }
>("invitations/details", async (invitationId, { rejectWithValue }) => {
  const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";
  const token = getCookie("access_token") || "";

  try {
    const res = await fetch(`${baseUrl}/users/invitations/${invitationId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return rejectWithValue("Не удалось получить детали приглашения");
    }

    const data = await res.json();

    return {
      specialist_name: data.specialist?.custom_user?.full_name || "Неизвестно",
      tracker_name: data.tracker?.custom_user?.full_name || "Неизвестно",
      proposed_payment: data.proposed_payment || 0,
      project_name: data.order_name || "Без названия",
      order_goal: data.order_goal || "Не указана",
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка загрузки");
  }
});

const invitationSlice = createSlice({
  name: "invitation",
  initialState,
  reducers: {
    setInvitationPayload: (state, action: PayloadAction<InvitationPayload>) => {
      state.payload = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendInvitation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.status = "success";
        state.payload = action.payload;
      })

      .addCase(sendInvitation.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Ошибка";
      })
      .addCase(updateInvitationPayment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateInvitationPayment.fulfilled,
        (state, action: PayloadAction<InvitationPayload>) => {
          state.status = "success";
          state.payload = action.payload;
        }
      )
      .addCase(updateInvitationPayment.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message || "Ошибка";
      })
      .addCase(getInvitationDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getInvitationDetails.fulfilled,
        (state, action: PayloadAction<InvitationDetails>) => {
          state.status = "success";
          state.details = action.payload;
        }
      )
      .addCase(getInvitationDetails.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message || "Ошибка";
      });
  },
});

export const { setInvitationPayload } = invitationSlice.actions;
export const selectInvitation = (state: RootState) => state.invitation;
export default invitationSlice.reducer;
