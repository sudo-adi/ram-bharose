import { Linking } from "react-native";

// Age calculation utility
export const calculateAge = (dob) => {
  if (!dob) return "Unknown";
  const parts = dob.split("/");
  if (parts.length !== 3) return "Unknown";

  const day = parseInt(parts[0]);
  const monthStr = parts[1];
  const yearStr = parts[2];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months.indexOf(monthStr);

  if (isNaN(day) || month === -1) return "Unknown";

  let year = parseInt(yearStr);
  if (year < 100) {
    year = year < 50 ? 2000 + year : 1900 + year;
  }

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