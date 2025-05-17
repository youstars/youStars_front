/* shared/api/files.ts */
import axios from "axios";
import { getCookie } from "shared/utils/cookies";

/** Можно грузить файлы как к специалисту, так и к клиенту.
 *
 *  @param entity        `"specialist"` | `"client"`
 *  @param entityId      id специалиста или клиента
 *  @param file          сам File
 *  @param name          отображаемое имя файла
 *  @param description   (необязательно) описание
 */
export const uploadEntityFile = async (
  entity: "specialist" | "client",
  entityId: number,
  file: File,
  name: string,
  description = ""
) => {
  const formData = new FormData();
  formData.append("name" , name);
  formData.append(entity , entityId.toString());   // ключ совпадает с полем модели
  formData.append("file" , file);
  formData.append("description", description);

  const token = getCookie("access_token");

  const url = `http://127.0.0.1:8000/files/${entity}-files/`; // → /files/specialist-files/ или /files/client-files/

  const { data } = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization  : `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return data;           // ← JSON ответа
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
