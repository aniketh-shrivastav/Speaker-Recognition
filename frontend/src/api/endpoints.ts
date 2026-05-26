import api from "@/api/client";
import type {
  AdminMetrics,
  DashboardSummary,
  RecognitionRecord,
  SpeakerRecord,
  TokenResponse,
} from "@/types";

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post("/auth/login", payload);
    return {
      access_token: data.access_token,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      },
    };
  },
  register: async (payload: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const { data } = await api.post("/auth/register", payload);
    return {
      access_token: data.access_token,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      },
    };
  },
};

export const speakerApi = {
  enroll: async (payload: { speaker_name: string; files: File[] }) => {
    const form = new FormData();
    form.append("speaker_name", payload.speaker_name);
    payload.files.forEach((file) => form.append("files", file));
    const { data } = await api.post("/speaker/enroll", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  recognize: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<RecognitionRecord>(
      "/speaker/recognize",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },
  history: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    speaker?: string;
  }) => {
    const { data } = await api.get<{
      items: RecognitionRecord[];
      total: number;
      page: number;
      page_size: number;
    }>("/speaker/history", { params });
    return data;
  },
  deleteSpeaker: async (speakerId: string) => {
    const { data } = await api.delete(`/speaker/${speakerId}`);
    return data;
  },
};

export const analyticsApi = {
  dashboard: async () => {
    const { data } = await api.get<DashboardSummary>("/analytics/dashboard");
    return data;
  },
  adminMetrics: async () => {
    const { data } = await api.get<AdminMetrics>("/admin/metrics");
    return data;
  },
  adminUsers: async () => {
    const { data } =
      await api.get<
        Array<{
          id: string;
          username: string;
          email: string;
          role: string;
          created_at: string;
        }>
      >("/admin/users");
    return data;
  },
  adminDeleteUser: async (userId: string) => {
    const { data } = await api.delete(`/admin/users/${userId}`);
    return data;
  },
  adminDeleteRecording: async (recordId: string) => {
    const { data } = await api.delete(`/admin/recordings/${recordId}`);
    return data;
  },
  retrain: async () => {
    const { data } = await api.post("/admin/retrain");
    return data;
  },
};
