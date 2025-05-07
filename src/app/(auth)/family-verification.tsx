import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "@/lib/supabase";

export default function FamilyVerification() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOrCreateUserProfile = async () => {
      if (!user) return;

      try {
        const userEmail = user.emailAddresses[0]?.emailAddress;
        if (!userEmail) {
          console.error("No email address found for user");
          return;
        }

        // Check if user profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", userEmail)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is the error code for "no rows found"
          console.error("Error checking user profile:", fetchError);
          return;
        }

        if (!existingProfile) {
          // Create a new profile for the user if one doesn't exist
          const { error: insertError } = await supabase.from("profiles").insert({
            email: userEmail,
            name: user.fullName || user.firstName || "New User",
          });

          if (insertError) {
            console.error("Error creating user profile:", insertError);
            return;
          }
        }

        // Redirect to tabs regardless of whether profile existed or was created
        router.replace("/(tabs)");
      } catch (err) {
        console.error("Error in authentication flow:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkOrCreateUserProfile();
  }, [user, router]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return null; // This component should never render anything except the loading indicator
  // return (
  //   <View className="flex-1 justify-center items-center">
  //     <ActivityIndicator size="large" color="#f97316" />
  //   </View>
  // );
}

// return (
//   <ScrollView className="flex-1 bg-white">
//     <View className="flex-1 items-center justify-center px-6 py-8 w-full max-w-md mx-auto">
//       {error && (
//         <Text className="text-red-500 text-center mb-4">{error}</Text>
//       )}

//       {step === "family-code" && (
//         <View className="w-full">
//           <Text className="text-xl font-bold text-center mb-6">
//             Enter Family Code
//           </Text>
//           <TextInput
//             value={familyCode}
//             onChangeText={setFamilyCode}
//             placeholder="Enter your family code"
//             className="border border-gray-300 rounded-lg p-4 mb-4 w-full"
//             keyboardType="numeric"
//           />
//           <TouchableOpacity
//             onPress={verifyFamilyCode}
//             className="bg-orange-500 py-4 rounded-xl w-full"
//           >
//             <Text className="text-white font-semibold text-lg text-center">
//               Verify
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {step === "otp" && (
//         <View className="w-full">
//           <Text className="text-xl font-bold text-center mb-6">
//             Enter OTP
//           </Text>
//           <TextInput
//             value={otp}
//             onChangeText={setOtp}
//             placeholder="Enter OTP sent to primary member"
//             className="border border-gray-300 rounded-lg p-4 mb-4 w-full"
//             keyboardType="numeric"
//           />
//           <TouchableOpacity
//             onPress={verifyOtp}
//             className="bg-orange-500 py-4 rounded-xl w-full"
//           >
//             <Text className="text-white font-semibold text-lg text-center">
//               Verify OTP
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {step === "member-selection" && (
//         <View className="w-full">
//           <Text className="text-xl font-bold text-center mb-6">
//             Select Your Profile
//           </Text>
//           {familyMembers.map((member) => (
//             <TouchableOpacity
//               key={member.id}
//               onPress={() => selectMember(member)}
//               className="border border-gray-300 rounded-lg p-4 mb-4 w-full"
//             >
//               <Text className="font-semibold">{member.name}</Text>
//               <Text className="text-gray-500">{member.relationship}</Text>
//               {member.email && (
//                 <Text className="text-red-500">Already registered</Text>
//               )}
//             </TouchableOpacity>
//           ))}
//           <TouchableOpacity
//             onPress={() => setStep("new-member-form")}
//             className="bg-orange-500 py-4 rounded-xl mt-4 w-full"
//           >
//             <Text className="text-white font-semibold text-lg text-center">
//               I am a new member
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {step === "new-member-form" && (
//         <View className="w-full">
//           <Text className="text-xl font-bold text-center mb-6">
//             New Member Registration
//           </Text>
//           {Object.keys(formData).map((key) => {
//             if (key === "family_no") return null; // Skip family_no as it's already set
//             return (
//               <View key={key} className="mb-4 w-full">
//                 <Text className="text-gray-700 mb-2">
//                   {key
//                     .split("_")
//                     .map(
//                       (word) => word.charAt(0).toUpperCase() + word.slice(1)
//                     )
//                     .join(" ")}
//                 </Text>
//                 <TextInput
//                   value={formData[key as keyof typeof formData]}
//                   onChangeText={(value) =>
//                     setFormData((prev) => ({ ...prev, [key]: value }))
//                   }
//                   placeholder={`Enter ${key.split("_").join(" ")}`}
//                   className="border border-gray-300 rounded-lg p-4 w-full"
//                 />
//               </View>
//             );
//           })}
//           <TouchableOpacity
//             onPress={submitNewMember}
//             className="bg-orange-500 py-4 rounded-xl mt-4 mb-8 w-full"
//           >
//             <Text className="text-white font-semibold text-lg text-center">
//               Submit
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   </ScrollView>
// );
// }
