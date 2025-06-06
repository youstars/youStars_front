// shared/api/endpoints.ts

export const API_ENDPOINTS = {
  auth: {
    login: "auth/token/create/",
    logout: "auth/token/logout/",
    registerSpecialist: "auth/users/specialist/registration/",
    registerClient: "auth/users/client/registration/",
  },
};
export const API_CLIENT = {
  getById: (id: number) => `users/client/${id}`,
  update: (id?: number) =>
    id ? `users/client/${id}/` : `users/clients/me/`,
};

export const API_CLIENTS = {
  getAll: "users/clients/",
};

export const API_FOLDERS = {
  getAll: "files/folders/",
  add: "files/folders/",
  rename: (id: number) => `files/folders/${id}/`,
  delete: (id: number) => `files/folders/${id}/`,
};

export const API_KNOWLEDGE = {
  getAll: "files/knowledge-files/",
  getByFolder: (folderId: number) => `files/knowledge-files/?folder=${folderId}`,
  upload: "files/knowledge-files/",
  delete: (id: number) => `files/knowledge-files/${id}/`,
};

export const API_ME = {
  get: "auth/users/me/",
  update: "auth/users/me/",
};

export const API_PROJECT = {
  getById: (id: string | number) => `project/${id}`,
};

export const API_SPECIALIST = {
  getById: (id: number) => `users/specialist/${id}`,
  updateMe: "users/specialists/me/",
};

export const API_PROFESSIONAL = {
  areas: "api/professional-areas/",
  profiles: "api/professional-profiles/",
};

export const API_PROJECT_TASKS = {
  getByProjectId: (id: number) => `projects/${id}/tasks/`,

};

export const API_INVITATIONS = {
  create: "users/create-invitations/",
};

