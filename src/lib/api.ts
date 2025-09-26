import axios from "axios";
import { AxiosRequestConfig } from "axios";

const API_BASE_URL = "https://pinpoint-notes-app.vercel.app/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Board API
export const boardAPI = {
  getAll: (config?: AxiosRequestConfig) => api.get("/boards", config),
  create: (data: { name: string; category?: string }) =>
    api.post("/boards", data),
};

// Note API
export const noteAPI = {
  getByBoard: (boardId: string) => api.get(`/notes/${boardId}`),
  create: (data: {
    title: string;
    category: string;
    color: string;
    boardId: string;
    description?: string;
    todos?: Array<{ text: string; checked: boolean }>;
    priority?: string;
    completionStatus?: string;
  }) => api.post("/notes", data),
  update: (
    id: string,
    data: {
      title?: string;
      category?: string;
      color?: string;
      boardId?: string;
      description?: string;
      todos?: Array<{ text: string; checked: boolean }>;
      priority?: string;
      completionStatus?: string;
    }
  ) => api.put(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
};
