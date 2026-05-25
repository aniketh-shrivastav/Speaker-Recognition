export type Role = 'user' | 'admin';

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: Role;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export type DashboardSummary = {
  total_registered_speakers: number;
  recognition_attempts: number;
  accuracy: number;
  recent_uploads: RecognitionRecord[];
  recent_speakers: SpeakerRecord[];
  activity: Array<{ day: string; attempts: number }>;
  system_status: string;
};

export type SpeakerRecord = {
  id: string;
  speaker_name: string;
  sample_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  audio_files: Array<{ path: string; original_name: string; created_at: string }>;
};

export type RecognitionRecord = {
  id: string;
  predicted_speaker: string;
  confidence: number;
  similarity_percentage: number;
  recognition_time_ms: number;
  timestamp: string;
  uploaded_audio: string;
  uploaded_filename?: string;
  waveform_image?: string;
  spectrogram_image?: string;
  mfcc_image?: string;
};

export type AdminMetrics = {
  users: number;
  speakers: number;
  recognitions: number;
  unknown_matches: number;
  model_accuracy: number;
};
