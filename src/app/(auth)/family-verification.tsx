import React from "react";
import { View } from "react-native";
import { router } from "expo-router";

export default function FamilyVerification() {
  // Redirect to tabs immediately since verification is done during login
  React.useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return null;
}
