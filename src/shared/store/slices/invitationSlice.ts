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

interface InvitationState {
  payload: InvitationPayload | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

const initialState: InvitationState = {
  payload: null,
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

    const res = await fetch(`${baseUrl}/users/manage-invitations/${id}/respond/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

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

    const res = await fetch(`${baseUrl}/users/manage-invitations/${id}/approve/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_approved: true }),
    });

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
      });
  },
});

export const { setInvitationPayload } = invitationSlice.actions;
export const selectInvitation = (state: RootState) => state.invitation;
export default invitationSlice.reducer;
