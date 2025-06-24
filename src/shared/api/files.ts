/* shared/api/files.ts */
import axios from "axios";
import { getCookie } from "shared/utils/cookies";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const uploadEntityFile = async (
  entity: "specialist" | "client" | "project" | "order" | "tracker" | "admin",
  entityId: number,
  file: File,
  name: string,
  description = ""
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append(entity, entityId.toString());
  formData.append("file", file);
  formData.append("description", description);

  const token = getCookie("access_token");

  const url = `http://127.0.0.1:8000/files/${entity}-files/`;

  const { data } = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return data;
};

export const uploadSpecialistFile = (
  file: File,
  name: string,
  specialistId: number,
  description = ""
) => uploadEntityFile("specialist", specialistId, file, name, description); 


export const uploadClientFile = (
  file: File,
  name: string,
  clientId: number,
  description = ""
) => uploadEntityFile("client", clientId, file, name, description);

export const uploadProjectFile = (
  file: File,
  name: string,
  projectId: number,
  description = ""
) => uploadEntityFile("project", projectId, file, name, description);

export const uploadTrackerFile = async (
  file: File,
  name: string,
  trackerId: number
) => {
  const token = getCookie("access_token");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("tracker", trackerId.toString());
  const response = await axios.post(
    `${API_BASE_URL}files/admin-files/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export async function deleteFileById(
  model: "project" | "specialist" | "client" | "order" | "tracker" | "admin",
  fileId: number
) {
  const token = getCookie("access_token");
  const response = await axios.delete(
    `${API_BASE_URL}files/${model}-files/${fileId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
