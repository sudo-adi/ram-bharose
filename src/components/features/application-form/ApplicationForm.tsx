import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { useFormSubmission } from "@/hooks";
import FormField from "./FormField"; // Import the new FormField component
import EducationLoanForm from "./EducationLoanForm";
import BusinessLoanForm from "./BusinessLoanForm";
import MulundHostelForm from "./MulundHostelForm";
import GirlsHostelForm from "./GirlsHostelForm";
import VatsalyadhamForm from "./VatsalyadhamForm";
import ImageUploadCard from "./ImageUploadCard"; // Import the new ImageUploadCard component

export default function ApplicationForm() {
  const [activeTab, setActiveTab] = useState("event");

  return (
    <View className="flex-1 bg-white">
      {/* Tab Navigation */}
      <View className="border-b border-gray-200 bg-white">
        <View className="flex-row justify-around py-1">
          <TabButton
            title="Event"
            isActive={activeTab === "event"}
            onPress={() => setActiveTab("event")}
          />
          <TabButton
            title="Donation"
            isActive={activeTab === "donation"}
            onPress={() => setActiveTab("donation")}
          />
          <TabButton
            title="Loans"
            isActive={activeTab === "loans"}
            onPress={() => setActiveTab("loans")}
          />
          <TabButton
            title="Enrollment"
            isActive={activeTab === "enrollment"}
            onPress={() => setActiveTab("enrollment")}
          />
        </View>
      </View>

      {/* Form Content */}
      <ScrollView
        className="flex-1 px-4 pt-5 bg-gray-50"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "event" && <EventForm />}
        {activeTab === "donation" && <DonationForm />}
        {activeTab === "loans" && <LoanForm />}
        {activeTab === "enrollment" && <EnrollmentForm />}
      </ScrollView>
    </View>
  );
}

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ title, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      className={`px-4 py-3 border-b-2 ${isActive ? "border-orange-500" : "border-transparent"}`}
      onPress={onPress}
    >
      <Text className={`font-medium ${isActive ? "text-orange-500" : "text-gray-500"}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function EventForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    duration: "",
    organizers: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.startTime?.trim())
      newErrors.startTime = "Start time is required";
    if (!formData.duration?.trim()) newErrors.duration = "Duration is required";
    if (!formData.organizers?.trim())
      newErrors.organizers = "Organizers are required";
    if (!formData.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const {
    submitEvent,
    loading: submitting,
    error: submitError,
  } = useFormSubmission();

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    try {
      const userPhone = await AsyncStorage.getItem("userPhone");
      const userId = await getUserIdByPhone(userPhone);

      if (!userId) {
        Alert.alert("Error", "User not found. Please login again.");
        return;
      }

      const success = await submitEvent({
        userId,
        name: formData.name,
        description: formData.description,
        startTime: formData.startTime,
        duration: formData.duration,
        organizers: formData.organizers.split(",").map((org) => org.trim()),
        image: formData.image,
      });

      if (success) {
        Alert.alert("Success", "Event submitted successfully");
        setFormData({
          name: "",
          description: "",
          startTime: "",
          duration: "",
          organizers: "",
          image: null,
        });
      } else {
        Alert.alert(
          "Error",
          submitError || "Failed to submit event. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      Alert.alert("Error", "Failed to submit event. Please try again.");
    }
  };

  return (
    <View className="pb-10">
      <Text className="text-lg text-center font-bold text-gray-800 mb-4">
        Event Details
      </Text>

      {/* Image Upload Card */}
      <ImageUploadCard
        onImageSelect={(file) => setFormData({ ...formData, image: file })}
        selectedImage={formData.image}
      />
      {errors.image && (
        <Text className="text-red-500 text-xs mb-4">{errors.image}</Text>
      )}

      <FormField
        label="Name"
        placeholder="Enter event name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        error={errors.name}
      />
      <FormField
        label="Description"
        placeholder="Enter event description"
        multiline={true}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        error={errors.description}
      />
      <FormField
        label="Start Time"
        placeholder="YYYY-MM-DD HH:MM"
        value={formData.startTime}
        onChangeText={(text) => setFormData({ ...formData, startTime: text })}
        error={errors.startTime}
      />
      <FormField
        label="Duration"
        placeholder="Enter duration (e.g., 2 hours)"
        value={formData.duration}
        onChangeText={(text) => setFormData({ ...formData, duration: text })}
        error={errors.duration}
      />
      <FormField
        label="Organizers"
        placeholder="Enter organizer names (comma separated)"
        value={formData.organizers}
        onChangeText={(text) => setFormData({ ...formData, organizers: text })}
        error={errors.organizers}
      />

      <TouchableOpacity
        className={`bg-orange-500 py-4 rounded-xl mt-6 ${loading ? "opacity-50" : ""
          }`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Submitting..." : "Submit Event"}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <Text className="text-xs text-gray-500 text-center">
          Event submissions will be reviewed by administrators
        </Text>
      </View>
    </View>
  );
}

const getUserIdByPhone = async (phone: string | null) => {
  if (!phone) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("mobile_no1", phone) // Changed 'phone' to 'mobile_no1'
      .single();

    if (error) {
      // If user doesn't exist, return null as per new requirement
      // Do not create a new profile here
      console.error("Error fetching user ID or user not found:", error);
      return null;
    }
    return data.id;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

function DonationForm() {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    cause: "",
    openTill: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (isNaN(Number(formData.amount)))
      newErrors.amount = "Amount must be a number";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.cause) newErrors.cause = "Cause is required";
    if (!formData.openTill) newErrors.openTill = "Open till date is required";
    if (!formData.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const {
    submitDonation,
    loading: submitting,
    error: submitError,
  } = useFormSubmission();

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    try {
      const userPhone = await AsyncStorage.getItem("userPhone");
      const userId = await getUserIdByPhone(userPhone);

      if (!userId) {
        Alert.alert("Error", "User not found. Please login again.");
        return;
      }

      const success = await submitDonation({
        userId,
        amount: Number(formData.amount),
        description: formData.description,
        cause: formData.cause,
        openTill: formData.openTill,
        image: formData.image,
      });

      if (success) {
        Alert.alert("Success", "Donation request submitted successfully");
        setFormData({
          amount: "",
          description: "",
          cause: "",
          openTill: "",
          image: null,
        });
      } else {
        Alert.alert(
          "Error",
          submitError || "Failed to submit donation request. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
      Alert.alert(
        "Error",
        "Failed to submit donation request. Please try again."
      );
    }
  };

  return (
    <View className="pb-10">
      <Text className="text-xl font-bold text-gray-800 mb-6 text-center">
        Create Donation Appeal
      </Text>

      {/* Image Upload Card */}
      <ImageUploadCard
        onImageSelect={(file) => setFormData({ ...formData, image: file })}
        selectedImage={formData.image}
      />
      {errors.image && (
        <Text className="text-red-500 text-xs mb-4">{errors.image}</Text>
      )}

      <FormField
        label="Amount"
        placeholder="Enter donation amount"
        keyboardType="numeric"
        value={formData.amount}
        onChangeText={(text) => setFormData({ ...formData, amount: text })}
        error={errors.amount}
      />
      <FormField
        label="Description"
        placeholder="Enter donation description"
        multiline={true}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        error={errors.description}
      />
      <FormField
        label="Cause"
        placeholder="Enter donation cause"
        value={formData.cause}
        onChangeText={(text) => setFormData({ ...formData, cause: text })}
        error={errors.cause}
      />
      <FormField
        label="Open Till"
        placeholder="YYYY-MM-DD"
        value={formData.openTill}
        onChangeText={(text) => setFormData({ ...formData, openTill: text })}
        error={errors.openTill}
      />

      <TouchableOpacity
        className={`bg-orange-500 py-4 rounded-xl mt-6 ${loading ? "opacity-50" : ""
          }`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Submitting..." : "Submit Donation"}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <Text className="text-xs text-gray-500 text-center">
          Donation requests will be reviewed by administrators
        </Text>
      </View>
    </View>
  );
}

// The old FormField component definition has been removed as it's now imported from ./FormField.tsx

function LoanForm() {
  const [activeLoanType, setActiveLoanType] = useState("education");
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  // const { submitLoanApplication, loading: submitting, error: submitError } = useFormSubmission(); // Assuming extension of the hook

  const handleLoanTypeChange = (type: string) => {
    setActiveLoanType(type);
    setFormData({}); // Reset form data when changing loan type
    setErrors({});
  };

  const validateLoanForm = () => {
    const newErrors: Record<string, string> = {};
    if (activeLoanType === "education") {
      // Section 1: Applicant Personal Details
      if (!formData.full_name) newErrors.full_name = "Full Name";
      if (!formData.date_of_birth) newErrors.date_of_birth = "Date of Birth";
      if (!formData.gender) newErrors.gender = "Gender";
      if (!formData.marital_status) newErrors.marital_status = "Marital Status";
      if (!formData.nationality) newErrors.nationality = "Nationality";
      if (!formData.mobile_number) newErrors.mobile_number = "Mobile Number";
      if (!formData.email_id) newErrors.email_id = "Email ID";
      if (!formData.permanent_address) newErrors.permanent_address = "Permanent Address";
      if (!formData.current_address) newErrors.current_address = "Current Address";
      if (!formData.aadhaar_number) newErrors.aadhaar_number = "Aadhaar Number";
      if (!formData.pan_number) newErrors.pan_number = "PAN Number";

      // Section 2: Course & Institution Details
      if (!formData.course_or_designation) newErrors.course_or_designation = "Course Name";
      if (!formData.level_of_study) newErrors.level_of_study = "Level of Study";
      if (!formData.mode_of_study) newErrors.mode_of_study = "Mode of Study";
      if (!formData.course_duration) newErrors.course_duration = "Course Duration";
      if (!formData.institution_name) newErrors.institution_name = "Institution Name";
      if (!formData.institution_type) newErrors.institution_type = "Institution Type";
      if (!formData.institution_address) newErrors.institution_address = "Institution Address";
      if (!formData.admission_letter_url) newErrors.admission_letter_url = "Admission Letter";
      if (!formData.commencement_date) newErrors.commencement_date = "Commencement Date";
      if (!formData.completion_date) newErrors.completion_date = "Expected Completion Date";

      // Section 3: Loan Requirement
      if (!formData.total_course_fee) newErrors.total_course_fee = "Total Course Fee";
      if (!formData.loan_amount) newErrors.loan_amount = "Total Loan Amount Required";
      if (!formData.repayment_period) newErrors.repayment_period = "Repayment Period";

      // Section 4: Academic Background
      if (!formData.tenth_details) newErrors.tenth_details = "10th Details are required";
      if (!formData.twelfth_details) newErrors.twelfth_details = "12th Details are required";
      if (!formData.academic_certificates_url) newErrors.academic_certificates_url = "Academic Certificates are required";

      // Section 6: Co-applicant/Guarantor Details (Mandatory)
      if (!formData.co_applicant_name) newErrors.co_applicant_name = "Co-applicant Full Name";
      if (!formData.co_applicant_relation) newErrors.co_applicant_relation = "Co-applicant Relation";
      if (!formData.co_applicant_dob) newErrors.co_applicant_dob = "Co-applicant Date of Birth";
      if (!formData.co_applicant_mobile) newErrors.co_applicant_mobile = "Co-applicant Mobile Number";
      if (!formData.co_applicant_email) newErrors.co_applicant_email = "Co-applicant Email ID";
      if (!formData.co_applicant_occupation) newErrors.co_applicant_occupation = "Co-applicant Occupation";
      if (!formData.co_applicant_income) newErrors.co_applicant_income = "Co-applicant Annual Income";
      if (!formData.co_applicant_pan) newErrors.co_applicant_pan = "Co-applicant PAN Number";
      if (!formData.co_applicant_aadhaar) newErrors.co_applicant_aadhaar = "Co-applicant Aadhaar Number";
      if (!formData.co_applicant_address_proof_url) newErrors.co_applicant_address_proof_url = "Co-applicant Address Proof";
      if (!formData.co_applicant_income_proof_url) newErrors.co_applicant_income_proof_url = "Co-applicant Income Proof";

      // Section 8: Bank Account Details
      if (!formData.bank_account_holder_name) newErrors.bank_account_holder_name = "Account Holder Name";
      if (!formData.bank_name) newErrors.bank_name = "Bank Name";
      if (!formData.bank_branch) newErrors.bank_branch = "Branch";
      if (!formData.bank_account_number) newErrors.bank_account_number = "Account Number";
      if (!formData.bank_ifsc_code) newErrors.bank_ifsc_code = "IFSC Code";

      // Declaration
      if (!formData.applicant_signature_url) newErrors.applicant_signature_url = "Applicant Signature";
      if (!formData.co_applicant_signature_url) newErrors.co_applicant_signature_url = "Co-applicant Signature";
      if (!formData.declaration_date) newErrors.declaration_date = "Declaration Date";

    } else if (activeLoanType === "business") {
      // Step 1: Applicant Personal Details
      if (!formData.full_name) newErrors.full_name = "Full Name";
      if (!formData.date_of_birth) newErrors.date_of_birth = "Date of Birth";
      if (!formData.gender) newErrors.gender = "Gender";
      if (!formData.residential_address) newErrors.residential_address = "Residential Address";
      if (!formData.marital_status) newErrors.marital_status = "Marital Status";
      if (!formData.pan_number) newErrors.pan_number = "PAN Number";
      if (!formData.aadhaar_number) newErrors.aadhaar_number = "Aadhaar Number";
      if (!formData.email) newErrors.email = "Email";
      if (!formData.mobile_number) newErrors.mobile_number = "Mobile Number";

      // Step 2: Business Details
      if (!formData.business_name) newErrors.business_name = "Business Name";
      if (!formData.nature_of_business) newErrors.nature_of_business = "Nature of Business";
      if (!formData.industry_type) newErrors.industry_type = "Industry Type";
      if (!formData.business_pan) newErrors.business_pan = "Business PAN";
      if (!formData.gstin) newErrors.gstin = "GSTIN";
      if (!formData.business_address) newErrors.business_address = "Business Address";
      if (!formData.udyam_registration) newErrors.udyam_registration = "Udyam Registration Number";
      if (!formData.business_type) newErrors.business_type = "Business Type";
      if (!formData.year_of_incorporation) newErrors.year_of_incorporation = "Year of Incorporation";

      // Step 3: Financial Information
      if (!formData.annual_turnover) newErrors.annual_turnover = "Annual Turnover (Latest Year)";
      if (!formData.net_profit) newErrors.net_profit = "Net Profit (Latest Year)";
      if (!formData.monthly_revenue) newErrors.monthly_revenue = "Monthly Revenue (Average)";
      // annual_turnover_year1,2,3 and net_profit_year1,2,3 are optional in schema, so not strictly validated here unless specified
      // monthly_revenue_6months is an array, validation might be more complex if specific format is needed

      // Step 4: Loan Details
      if (!formData.loan_amount) newErrors.loan_amount = "Loan Amount Required";
      if (!formData.loan_tenure) newErrors.loan_tenure = "Loan Tenure";
      if (!formData.loan_purpose) newErrors.loan_purpose = "Purpose of Loan";

      // Step 5: Document Uploads (Required ones)
      if (!formData.pan_card_url) newErrors.pan_card_url = "PAN Card upload";
      if (!formData.aadhaar_card_url) newErrors.aadhaar_card_url = "Aadhaar Card upload";
      // bank_statements_url, itr_documents_url, etc. might be conditionally required

      // Step 8: Bank Account Details for Disbursement
      if (!formData.bank_account_holder_name) newErrors.bank_account_holder_name = "Bank Account Holder Name";
      if (!formData.bank_name) newErrors.bank_name = "Bank Name";
      if (!formData.account_number) newErrors.account_number = "Account Number";
      if (!formData.ifsc_code) newErrors.ifsc_code = "IFSC Code";
      if (!formData.bank_branch) newErrors.bank_branch = "Bank Branch";

      // Step 9: Declaration and Signature
      if (!formData.declaration_accepted) newErrors.declaration_accepted = "Declaration acceptance is required.";
      if (!formData.e_signature) newErrors.e_signature = "E-signature is required.";
      // co_applicant_signature_url is optional based on schema, so not strictly validated here unless specified
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // console.log("Validation Errors:", newErrors);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // TODO: Add proper validation based on activeLoanType and specific fields
    // if (!validateForm()) { // Assuming validateForm is adapted from validateLoanForm or a new one is created
    //   Alert.alert("Validation Error", "Please fill in all required fields correctly.");
    //   return;
    // }
    if (!validateLoanForm()) { // Retain existing validation call
      Alert.alert("Validation Error", "Please fill in all required fields highlighted in red. Missing: " + Object.values(errors).join(', '));
      return;
    }
    setLoading(true);

    try {
      const userPhone = await AsyncStorage.getItem("userPhone");
      const userId = await getUserIdByPhone(userPhone);

      if (!userId) {
        Alert.alert("Error", "User not found. Please login again.");
        setLoading(false);
        return;
      }

      let tableName = "";
      let imageFieldKeys: string[] = [];

      if (activeLoanType === "education") {
        tableName = "education_loan_applications";
        // These keys should match the formData keys used in EducationLoanForm for file uploads
        imageFieldKeys = ["admission_letter_url", "academic_certificates_url", "salary_slips_url",
          "co_applicant_address_proof_url", "co_applicant_income_proof_url", "applicant_signature_url",
          "co_applicant_signature_url"
          // Add other file fields from EducationLoanForm if they exist and are file objects
          // e.g., "photoApplicant", "aadhaarCard", "panCard", "passportCopy", "addressProof", "studyPermit",
          // "coApplicantPhoto", "coApplicantAadhaar", "coApplicantPAN",
          // "feeStructure", "bankStatements", "collateralDocuments"
        ];
      } else if (activeLoanType === "business") {
        tableName = "business_loan_applications";
        // These keys should match the formData keys used in BusinessLoanForm for file uploads
        imageFieldKeys = [
          "pan_card_url", "aadhaar_card_url", "gst_certificate_url",
          "bank_statements_url", "itr_documents_url", "audited_financial_statements_url",
          "co_applicant_id_proof_url", "co_applicant_income_proof_url",
          "collateral_ownership_proof_url", "udyam_registration_url",
          "business_address_proof_url", "collateral_documents_url", "e_signature",
          // Add other file fields from BusinessLoanForm if they exist and are file objects
          // e.g. "applicant_photo", "business_plan_document", "guarantor_photo", etc.
        ];
      } else {
        Alert.alert("Error", "Invalid loan type selected.");
        setLoading(false);
        return;
      }

      const dataToSubmit: Record<string, any> = { user_id: userId, bank_account_holder_name: formData.bank_account_holder_name }; // Use activeLoanType
      const filesToUpload: Array<{ fieldName: string; file: any }> = [];

      // Prepare dataToSubmit by excluding file objects and converting dates/numbers if necessary
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          if (imageFieldKeys.includes(key) && formData[key] && typeof formData[key] === 'object' && formData[key].uri) {
            filesToUpload.push({ fieldName: key, file: formData[key] });
          } else if (formData[key] !== null && formData[key] !== undefined) {
            dataToSubmit[key] = formData[key];
          }
        }
      }

      // Remove original file objects from dataToSubmit if they were not handled above
      imageFieldKeys.forEach(key => {
        if (dataToSubmit[key] && typeof dataToSubmit[key] === 'object' && dataToSubmit[key].uri) {
          delete dataToSubmit[key];
        }
      });

      const { data: insertedData, error: insertError } = await supabase
        .from(tableName)
        .insert([dataToSubmit])
        .select()
        .single();

      if (insertError || !insertedData) {
        console.error(`Error inserting ${activeLoanType} loan application:`, insertError);
        Alert.alert("Error", `Failed to submit loan application: ${insertError?.message || 'Unknown error'}`);
        setFormData({});
        setLoading(false);
        return;
      }

      const recordId = insertedData.id;
      const uploadedFileUrls: Record<string, string | string[]> = {}; // Value can be string or string[] for multi-file fields

      if (filesToUpload.length > 0) {
        for (const { fieldName, file } of filesToUpload) {
          try {
            const fileExt = file.mimeType.split('/')[1] || 'dat';
            const fileNameForStorage = `${fieldName}.${fileExt}`;
            const filePathInBucket = `${userId}/${fileNameForStorage}`;

            const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });

            const { error: uploadError } = await supabase.storage
              .from("application-docs") // Ensure this bucket exists and has correct policies
              .upload(filePathInBucket, decode(base64), {
                contentType: file.mimeType || 'application/octet-stream',
                upsert: true,
              });

            if (uploadError) {
              console.error(`Error uploading ${fieldName} for record ${recordId}:`, uploadError);
              // Optionally, log this specific failure but continue other uploads
              continue;
            }

            const { data: publicUrlData } = supabase.storage
              .from("application-docs")
              .getPublicUrl(filePathInBucket);

            if (publicUrlData?.publicUrl) {
              // Supabase schema might expect fieldName_url or just fieldName for the URL
              // Adjust uploadedFileUrls key accordingly. Assuming fieldName_url for now.
              uploadedFileUrls[fieldName] = publicUrlData.publicUrl;
            } else {
              console.warn(`Could not get public URL for ${filePathInBucket}`);
            }
          } catch (e: any) {
            console.error(`Exception during upload for ${fieldName} (record ${recordId}):`, e);
          }
        }

        if (Object.keys(uploadedFileUrls).length > 0) {
          const { error: updateError } = await supabase
            .from(tableName)
            .update(uploadedFileUrls)
            .eq("id", recordId);

          if (updateError) {
            console.error(`Error updating record ${recordId} with file URLs:`, updateError);
            Alert.alert("Partial Success", "Application submitted, but failed to save some document links. Please contact support if issues persist.");
          }
        }
      }

      Alert.alert("Success", "Loan application submitted successfully!");
      // setFormData({});
      setErrors({});
      // Consider navigation or further UI updates here

    } catch (error: any) {
      console.error("Error submitting loan form:", error);
      Alert.alert("Error", `An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="pb-10">
      <Text className="text-xl font-bold text-gray-800 text-center">
        Apply for a Loan
      </Text>
      <View className="flex-row justify-around mb-6 border-b border-gray-200">
        <TabButton
          title="Education Loan"
          isActive={activeLoanType === "education"}
          onPress={() => handleLoanTypeChange("education")}
        />
        <TabButton
          title="Business Loan"
          isActive={activeLoanType === "business"}
          onPress={() => handleLoanTypeChange("business")}
        />
      </View>

      {activeLoanType === "education" && (
        <EducationLoanForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
      )}
      {activeLoanType === "business" && (
        <BusinessLoanForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
      )}

      <TouchableOpacity
        className={`bg-orange-500 py-4 rounded-xl mt-8 ${loading ? "opacity-50" : ""}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Submitting..." : `Submit ${activeLoanType.charAt(0).toUpperCase() + activeLoanType.slice(1)} Loan`}
        </Text>
      </TouchableOpacity>
      <View className="mt-4">
        <Text className="text-xs text-gray-500 text-center">
          Loan applications will be reviewed by administrators.
        </Text>
      </View>
    </View>
  );
}

function EnrollmentForm() {
  const { submitMulundHostelApplication, loading: submitting, error: submitError } = useFormSubmission();
  const [activeEnrollmentType, setActiveEnrollmentType] = useState("mulund_hostel");
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  // const { submitEnrollmentApplication, loading: submitting, error: submitError } = useFormSubmission(); // Assuming extension of the hook

  const handleEnrollmentTypeChange = (type: string) => {
    setActiveEnrollmentType(type);
    setFormData({}); // Reset form data when changing enrollment type
    setErrors({});
  };

  const getEnrollmentTypeTitle = () => {
    switch (activeEnrollmentType) {
      case "mulund_hostel": return "Mulund Hostel";
      case "girls_hostel": return "Girls Hostel";
      case "vatsalyadham": return "Vatsalyadham";
      default: return "";
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Personal Details
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.nationality) newErrors.nationality = "Nationality is required";
    if (!formData.mobile_number) newErrors.mobile_number = "Mobile number is required";
    if (!formData.email_id) newErrors.email_id = "Email is required";
    if (!formData.aadhaar_number) newErrors.aadhaar_number = "Aadhaar number is required";
    if (!formData.pan_number) newErrors.pan_number = "PAN number is required";
    if (!formData.blood_group) newErrors.blood_group = "Blood group is required";

    // Address Information
    if (!formData.permanent_address) newErrors.permanent_address = "Permanent address is required";
    if (!formData.permanent_city) newErrors.permanent_city = "City is required";
    if (!formData.permanent_state) newErrors.permanent_state = "State is required";
    if (!formData.permanent_pincode) newErrors.permanent_pincode = "Pincode is required";

    // Academic/Employment Details
    if (!formData.education_level) newErrors.education_level = "Education level is required";
    if (!formData.institution_name) newErrors.institution_name = "Institution name is required";
    if (!formData.course_or_designation) newErrors.course_or_designation = "Course name is required";
    if (!formData.year_of_study) newErrors.year_of_study = "Year of study is required";
    if (!formData.employment_status) newErrors.employment_status = "Employment status is required";

    // Guardian Information
    if (!formData.guardian_name) newErrors.guardian_name = "Guardian name is required";
    if (!formData.guardian_relation) newErrors.guardian_relation = "Guardian relation is required";
    if (!formData.guardian_mobile) newErrors.guardian_mobile = "Guardian mobile is required";
    if (!formData.guardian_address) newErrors.guardian_address = "Guardian address is required";
    if (!formData.guardian_occupation) newErrors.guardian_occupation = "Guardian occupation is required";

    // Health Details
    if (!formData.emergency_contact_name) newErrors.emergency_contact_name = "Emergency contact name is required";
    if (!formData.emergency_contact_number) newErrors.emergency_contact_number = "Emergency contact number is required";

    // Document Uploads
    if (!formData.photograph) newErrors.photograph = "Photograph is required";
    if (!formData.aadhaar_card) newErrors.aadhaar_card = "Aadhaar card is required";
    if (!formData.pan_card) newErrors.pan_card = "PAN card is required";
    if (!formData.id_proof) newErrors.id_proof = "ID proof is required";
    if (!formData.guardian_id_proof) newErrors.guardian_id_proof = "Guardian ID proof is required";

    // Declaration
    if (!formData.declaration_date) newErrors.declaration_date = "Declaration date is required";
    if (!formData.declaration_signed) newErrors.declaration_signed = "Declaration must be signed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    try {
      const userPhone = await AsyncStorage.getItem("userPhone");
      const userId = await getUserIdByPhone(userPhone);

      if (!userId) {
        Alert.alert("Error", "User not found. Please login again.");
        return;
      }

      const success = await submitMulundHostelApplication({
        userId,
        ...formData
      });

      if (success) {
        Alert.alert("Success", "Hostel application submitted successfully");
        setFormData({});
      } else {
        Alert.alert(
          "Error: Failed to submit hostel application. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting hostel application:", error);
      Alert.alert("Error", "Failed to submit hostel application. Please try again.");
    }
  };

  return (
    <View className="pb-10">
      <Text className="text-xl font-bold text-gray-800 text-center">
        Enrollment Application
      </Text>
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 border-b border-gray-200"> */}
      <View className="border-b border-gray-200">
        <View className="flex-row justify-around py-1">
          <TabButton
            title="Mulund Hostel"
            isActive={activeEnrollmentType === "mulund_hostel"}
            onPress={() => handleEnrollmentTypeChange("mulund_hostel")}
          />
          <TabButton
            title="Girls Hostel"
            isActive={activeEnrollmentType === "girls_hostel"}
            onPress={() => handleEnrollmentTypeChange("girls_hostel")}
          />
          <TabButton
            title="Vatsalyadham"
            isActive={activeEnrollmentType === "vatsalyadham"}
            onPress={() => handleEnrollmentTypeChange("vatsalyadham")}
          />
        </View>
      </View>

      {activeEnrollmentType === "mulund_hostel" && (
        <MulundHostelForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
      )}
      {activeEnrollmentType === "girls_hostel" && (
        <GirlsHostelForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
      )}
      {activeEnrollmentType === "vatsalyadham" && (
        <VatsalyadhamForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
      )}

      <TouchableOpacity
        className={`bg-orange-500 py-4 rounded-xl mt-8 ${loading ? "opacity-50" : ""}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Submitting..." : `Submit ${getEnrollmentTypeTitle()} Enrollment`}
        </Text>
      </TouchableOpacity>
      <View className="mt-4">
        <Text className="text-xs text-gray-500 text-center">
          Enrollment applications will be reviewed by administrators.
        </Text>
      </View>
    </View>
  );
}
