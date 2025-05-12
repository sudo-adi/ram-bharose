export type Business = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  created_at: string;
  images?: string[];
  logo?: string;
};