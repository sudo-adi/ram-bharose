export interface DonationFormData {
  userId: string;
  amount: number;
  description: string;
  cause: string;
  openTill: string;
  image?: File;
}