export type Committee = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  location: string;
  member_name: string;
};

export type CommitteeImage = {
  name: string;
  url: string;
  created_at: string;
  size: number;
  contentType: string;
};