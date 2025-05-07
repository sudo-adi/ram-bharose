import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Text, View, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";

// Make sure to complete any pending auth sessions
WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  // Clear any pending browser sessions on component mount
  useEffect(() => {
    async function clearBrowserSessions() {
      try {
        await WebBrowser.dismissBrowser();
      } catch (e) {
        // Ignore errors from dismissing browser
        console.log("No browser session to dismiss");
      }
    }

    clearBrowserSessions();
  }, []);

  // Show loading indicator while auth is being determined
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={{ marginTop: 12, color: "#666" }}>Loading...</Text>
      </View>
    );
  }

  return isSignedIn ? (
    <Redirect href="/(auth)/family-verification" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
