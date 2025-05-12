export interface EventFormData {
  userId: string;
  name: string;
  description: string;
  startTime: string;
  duration: string;
  organizers: string[];
  image?: File;
}

export interface Event {
  time: string;
  date: string;
  id: string;
  user_id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  city: string;
  organizer_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  created_at: string;
  image?: string;
}