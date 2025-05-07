import { Linking } from "react-native";

export const handleCall = (phoneNumber: string) => {
  Linking.openURL(`tel:${phoneNumber}`);
};

export const handleEmail = (email: string) => {
  Linking.openURL(`mailto:${email}`);
};

export const handleWebsite = (website: string) => {
  // Add https:// if not present
  const url = website.startsWith("http") ? website : `https://${website}`;
  Linking.openURL(url);
};

export const handleWhatsApp = (phoneNumber: string) => {
  // Remove any non-numeric characters from the phone number
  const formattedNumber = phoneNumber.replace(/\D/g, "");
  Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
};