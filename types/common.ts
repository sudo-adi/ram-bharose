export type UseQueryResult<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

export type Doctor = {
  id: number;
  name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  clinic_address: string;
  contact_email: string;
  contact_phone: string;
  available_timings: string;
  created_at: string;
};

export type ShubhChintak = {
  id: number;
  created_at: string;
  file_url: string;
  title: string;
  cover_image_name: string;
  cover_image_url?: string;
};

export interface Article {
  id: string;
  user_id: string;
  title: string;
  body: string;
  image: string;
  created_at: string;
  // userName: string;
}