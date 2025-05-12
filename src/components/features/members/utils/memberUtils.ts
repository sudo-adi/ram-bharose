import { Linking } from "react-native";

// Age calculation utility
export const calculateAge = (dob) => {
  if (!dob) return "Unknown";
  const parts = dob.split("-"); // Assuming the format is 'yyyy-mm-dd'
  if (parts.length !== 3) return "Unknown";

  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Month is 0-indexed
  const day = parseInt(parts[2]);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return "Unknown";

  const birthDate = new Date(year, month, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age.toString();
};

// Contact action utilities
export const handleCall = (phoneNumber) => {
  if (phoneNumber && phoneNumber !== "Not available") {
    Linking.openURL(`tel:${phoneNumber}`);
  }
};

export const handleWhatsApp = (phoneNumber) => {
  if (phoneNumber && phoneNumber !== "Not available") {
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
  }
};

export const handleEmail = (email) => {
  if (email && email !== "Not available") {
    Linking.openURL(`mailto:${email}`);
  }
};

// Image placeholder utility
export const getPlaceholderImage = (member) => {
  const age = parseInt(typeof member.age === 'string' ? member.age : calculateAge(member.date_of_birth));
  const gender = member.gender?.toLowerCase() || "";

  if (isNaN(age)) {
    // Default fallback if age cannot be determined
    return require("../../../../../assets/icon.png");
  }

  if (gender === "male") {
    if (age < 18) {
      return require("../../../../../assets/boy.png");
    } else {
      return require("../../../../../assets/man.png");
    }
  } else if (gender === "female") {
    if (age < 18) {
      return require("../../../../../assets/girl.png");
    } else {
      return require("../../../../../assets/women.png");
    }
  } else {
    return require("../../../../../assets/icon.png");
  }
};
// Add this to ../utils/memberUtils.ts

export const handleSMS = (phone: string) => {
  if (phone) {
    const url = `sms:${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("SMS is not supported on this device");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  }
};