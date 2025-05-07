import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  // Redirect to tabs by default, the AuthenticationWrapper will handle
  // redirecting unauthenticated users to login
  return <Redirect href="/(tabs)" />;
}
