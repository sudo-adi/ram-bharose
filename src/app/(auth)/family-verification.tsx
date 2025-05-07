import React, { useEffect } from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "@/lib/supabase";
import { useFamilyVerification } from "@/hooks/useSupabase";

type FamilyMember = {
  id: number;
  name: string;
  email: string | null;
  relationship: string;
};

export default function FamilyVerification() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<
    "family-code" | "otp" | "member-selection" | "new-member-form"
  >("family-code");
  const [familyCode, setFamilyCode] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    family_no: "",
    surname: "",
    name: "",
    fathers_or_husbands_name: "",
    father_in_laws_name: "",
    gender: "",
    relationship: "",
    marital_status: "",
    marriage_date: "",
    date_of_birth: "",
    education: "",
    stream: "",
    qualification: "",
    occupation: "",
    email: "",
    profile_pic: "",
    family_cover_pic: "",
    blood_group: "",
    native_place: "",
    residential_address_line1: "",
    residential_address_state: "",
    residential_address_city: "",
    pin_code: "",
    residential_landline: "",
    office_address: "",
    office_address_state: "",
    office_address_city: "",
    office_address_pin: "",
    landline_office: "",
    mobile_no1: "",
    mobile_no2: "",
    date_of_demise: "",
  });

  const {
    data: familyData,
    error: familyError,
    refetch: verifyFamily,
  } = useFamilyVerification(familyCode);

  // Add useEffect to check if user is already verified when component mounts
  useEffect(() => {
    const checkExistingVerification = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", user.emailAddresses[0]?.emailAddress)
          .single();

        if (data) {
          // User is already verified, redirect to tabs
          router.replace("/(tabs)");
        }
      } catch (err) {
        console.error("Error checking verification:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingVerification();
  }, [user, router]);

  const verifyFamilyCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      await verifyFamily();

      if (familyError) {
        setError("Error verifying family code");
        return;
      }

      if (!familyData || familyData.length === 0) {
        setError("Invalid family code");
        return;
      }

      const userEmail = user?.emailAddresses[0]?.emailAddress;
      const existingMember = familyData.find(
        (member) => member.email === userEmail
      );

      if (existingMember) {
        router.replace("/(tabs)");
        return;
      }

      const selfMember = familyData.find(
        (member) => member.relationship.toLowerCase() === "self"
      );
      if (!selfMember || !selfMember.mobile_no1) {
        setError("Unable to find primary family member");
        return;
      }

      setFamilyMembers(familyData);
      setStep("otp");
    } catch (err) {
      setError("Error verifying family code");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    // TODO: Implement actual OTP verification
    // For now, we'll just accept any OTP
    setStep("member-selection");
  };

  const selectMember = async (member: FamilyMember) => {
    if (member.email) {
      setError("This member is already using a different email");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ email: user?.emailAddresses[0]?.emailAddress })
        .eq("id", member.id)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(
          "Permission denied - please check if you have proper access rights"
        );
      }
      router.replace("/(tabs)");
    } catch (err) {
      setError("Error updating member information");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitNewMember = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("family_members").insert({
        ...formData,
        family_no: familyCode,
        email: user?.emailAddresses[0]?.emailAddress,
      });

      if (error) throw error;
      router.replace("/(tabs)");
    } catch (err) {
      setError("Error creating new member");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6 py-8 w-full max-w-md mx-auto">
        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        {step === "family-code" && (
          <View className="w-full">
            <Text className="text-xl font-bold text-center mb-6">
              Enter Family Code
            </Text>
            <TextInput
              value={familyCode}
              onChangeText={setFamilyCode}
              placeholder="Enter your family code"
              className="border border-gray-300 rounded-lg p-4 mb-4 w-full"
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={verifyFamilyCode}
              className="bg-orange-500 py-4 rounded-xl w-full"
            >
              <Text className="text-white font-semibold text-lg text-center">
                Verify
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "otp" && (
          <View className="w-full">
            <Text className="text-xl font-bold text-center mb-6">
              Enter OTP
            </Text>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP sent to primary member"
              className="border border-gray-300 rounded-lg p-4 mb-4 w-full"
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={verifyOtp}
              className="bg-orange-500 py-4 rounded-xl w-full"
            >
              <Text className="text-white font-semibold text-lg text-center">
                Verify OTP
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "member-selection" && (
          <View className="w-full">
            <Text className="text-xl font-bold text-center mb-6">
              Select Your Profile
            </Text>
            {familyMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                onPress={() => selectMember(member)}
                className="border border-gray-300 rounded-lg p-4 mb-4 w-full"
              >
                <Text className="font-semibold">{member.name}</Text>
                <Text className="text-gray-500">{member.relationship}</Text>
                {member.email && (
                  <Text className="text-red-500">Already registered</Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setStep("new-member-form")}
              className="bg-orange-500 py-4 rounded-xl mt-4 w-full"
            >
              <Text className="text-white font-semibold text-lg text-center">
                I am a new member
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "new-member-form" && (
          <View className="w-full">
            <Text className="text-xl font-bold text-center mb-6">
              New Member Registration
            </Text>
            {Object.keys(formData).map((key) => {
              if (key === "family_no") return null; // Skip family_no as it's already set
              return (
                <View key={key} className="mb-4 w-full">
                  <Text className="text-gray-700 mb-2">
                    {key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Text>
                  <TextInput
                    value={formData[key as keyof typeof formData]}
                    onChangeText={(value) =>
                      setFormData((prev) => ({ ...prev, [key]: value }))
                    }
                    placeholder={`Enter ${key.split("_").join(" ")}`}
                    className="border border-gray-300 rounded-lg p-4 w-full"
                  />
                </View>
              );
            })}
            <TouchableOpacity
              onPress={submitNewMember}
              className="bg-orange-500 py-4 rounded-xl mt-4 mb-8 w-full"
            >
              <Text className="text-white font-semibold text-lg text-center">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
