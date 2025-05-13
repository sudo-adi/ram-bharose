import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
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
      if (!formData.fullName) newErrors.fullName = "Full Name";
      if (!formData.dob) newErrors.dob = "Date of Birth";
      if (!formData.gender) newErrors.gender = "Gender";
      if (!formData.maritalStatus) newErrors.maritalStatus = "Marital Status";
      if (!formData.nationality) newErrors.nationality = "Nationality";
      if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile Number";
      if (!formData.emailId) newErrors.emailId = "Email ID";
      if (!formData.permanentAddress) newErrors.permanentAddress = "Permanent Address";
      if (!formData.currentAddress) newErrors.currentAddress = "Current Address";
      if (!formData.aadhaarNumber) newErrors.aadhaarNumber = "Aadhaar Number";
      if (!formData.panNumber) newErrors.panNumber = "PAN Number";

      // Section 2: Course & Institution Details
      if (!formData.courseName) newErrors.courseName = "Course Name";
      if (!formData.levelOfStudy) newErrors.levelOfStudy = "Level of Study";
      if (!formData.modeOfStudy) newErrors.modeOfStudy = "Mode of Study";
      if (!formData.courseDuration) newErrors.courseDuration = "Course Duration";
      if (!formData.institutionName) newErrors.institutionName = "Institution Name";
      if (!formData.institutionType) newErrors.institutionType = "Institution Type";
      if (!formData.institutionAddress) newErrors.institutionAddress = "Institution Address";
      if (!formData.admissionLetter) newErrors.admissionLetter = "Admission Letter";
      if (!formData.commencementDate) newErrors.commencementDate = "Commencement Date";
      if (!formData.expectedCompletionDate) newErrors.expectedCompletionDate = "Expected Completion Date";

      // Section 3: Loan Requirement
      if (!formData.totalCourseFee) newErrors.totalCourseFee = "Total Course Fee";
      if (!formData.totalLoanAmountRequired) newErrors.totalLoanAmountRequired = "Total Loan Amount Required";
      if (!formData.repaymentPeriod) newErrors.repaymentPeriod = "Repayment Period";

      // Section 4: Academic Background
      if (!formData.tenthDetails) newErrors.tenthDetails = "10th Details are required";
      if (!formData.twelfthDetails) newErrors.twelfthDetails = "12th Details are required";
      if (!formData.academicCertificates) newErrors.academicCertificates = "Academic Certificates are required";

      // Section 6: Co-applicant/Guarantor Details (Mandatory)
      if (!formData.coApplicantFullName) newErrors.coApplicantFullName = "Co-applicant Full Name";
      if (!formData.coApplicantRelation) newErrors.coApplicantRelation = "Co-applicant Relation";
      if (!formData.coApplicantDob) newErrors.coApplicantDob = "Co-applicant Date of Birth";
      if (!formData.coApplicantMobileNumber) newErrors.coApplicantMobileNumber = "Co-applicant Mobile Number";
      if (!formData.coApplicantEmailId) newErrors.coApplicantEmailId = "Co-applicant Email ID";
      if (!formData.coApplicantOccupation) newErrors.coApplicantOccupation = "Co-applicant Occupation";
      if (!formData.coApplicantAnnualIncome) newErrors.coApplicantAnnualIncome = "Co-applicant Annual Income";
      if (!formData.coApplicantPanNumber) newErrors.coApplicantPanNumber = "Co-applicant PAN Number";
      if (!formData.coApplicantAadhaarNumber) newErrors.coApplicantAadhaarNumber = "Co-applicant Aadhaar Number";
      if (!formData.coApplicantAddressProof) newErrors.coApplicantAddressProof = "Co-applicant Address Proof";
      if (!formData.coApplicantIncomeProof) newErrors.coApplicantIncomeProof = "Co-applicant Income Proof";

      // Section 8: Bank Account Details
      if (!formData.accountHolderName) newErrors.accountHolderName = "Account Holder Name";
      if (!formData.bankName) newErrors.bankName = "Bank Name";
      if (!formData.branch) newErrors.branch = "Branch";
      if (!formData.accountNumber) newErrors.accountNumber = "Account Number";
      if (!formData.ifscCode) newErrors.ifscCode = "IFSC Code";

      // Declaration
      if (!formData.applicantSignature) newErrors.applicantSignature = "Applicant Signature";
      if (!formData.coApplicantSignature) newErrors.coApplicantSignature = "Co-applicant Signature";
      if (!formData.declarationDate) newErrors.declarationDate = "Declaration Date";

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
      if (!formData.declaration_accepted) newErrors.declaration_accepted = "Declaration acceptance";
      if (!formData.e_signature) newErrors.e_signature = "E-Signature";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateLoanForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields highlighted in red. Missing: " + Object.values(errors).join(', '));
      return;
    }

    setLoading(true);
    try {
      const userPhone = await AsyncStorage.getItem('userPhone');
      const userId = await getUserIdByPhone(userPhone);

      if (!userId) {
        Alert.alert('Error', 'User not found. Please login again.');
        setLoading(false);
        return;
      }

      if (activeLoanType === "business") {
        const monthlyRevenue6MonthsArray = formData.monthly_revenue_6months
          ? formData.monthly_revenue_6months.split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n))
          : null;

        const businessLoanPayload = {
          user_id: userId,
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth) : null,
          gender: formData.gender,
          residential_address: formData.residential_address,
          marital_status: formData.marital_status,
          cibil_score: formData.cibil_score ? parseInt(formData.cibil_score) : null,
          pan_number: formData.pan_number,
          aadhaar_number: formData.aadhaar_number,
          email: formData.email,
          mobile_number: formData.mobile_number,
          business_name: formData.business_name,
          nature_of_business: formData.nature_of_business,
          industry_type: formData.industry_type,
          business_pan: formData.business_pan,
          gstin: formData.gstin,
          business_address: formData.business_address,
          udyam_registration: formData.udyam_registration,
          website_url: formData.website_url,
          annual_turnover: formData.annual_turnover ? parseFloat(formData.annual_turnover) : null,
          net_profit: formData.net_profit ? parseFloat(formData.net_profit) : null,
          monthly_revenue: formData.monthly_revenue ? parseFloat(formData.monthly_revenue) : null,
          current_liabilities: formData.current_liabilities ? parseFloat(formData.current_liabilities) : null,
          loan_amount: formData.loan_amount ? parseFloat(formData.loan_amount) : null,
          loan_tenure: formData.loan_tenure ? parseInt(formData.loan_tenure) : null,
          preferred_emi: formData.preferred_emi ? parseFloat(formData.preferred_emi) : null,
          disbursement_date: formData.disbursement_date ? new Date(formData.disbursement_date) : null,
          bank_statements_url: formData.bank_statements_url ? [formData.bank_statements_url?.uri || formData.bank_statements_url] : null, // Assuming single file upload for now
          itr_documents_url: formData.itr_documents_url ? [formData.itr_documents_url?.uri || formData.itr_documents_url] : null, // Assuming single file upload for now
          pan_card_url: formData.pan_card_url?.uri || formData.pan_card_url,
          aadhaar_card_url: formData.aadhaar_card_url?.uri || formData.aadhaar_card_url,
          gst_certificate_url: formData.gst_certificate_url?.uri || formData.gst_certificate_url,
          business_type: formData.business_type,
          year_of_incorporation: formData.year_of_incorporation ? new Date(formData.year_of_incorporation) : null,
          annual_turnover_year1: formData.annual_turnover_year1 ? parseFloat(formData.annual_turnover_year1) : null,
          annual_turnover_year2: formData.annual_turnover_year2 ? parseFloat(formData.annual_turnover_year2) : null,
          annual_turnover_year3: formData.annual_turnover_year3 ? parseFloat(formData.annual_turnover_year3) : null,
          net_profit_year1: formData.net_profit_year1 ? parseFloat(formData.net_profit_year1) : null,
          net_profit_year2: formData.net_profit_year2 ? parseFloat(formData.net_profit_year2) : null,
          net_profit_year3: formData.net_profit_year3 ? parseFloat(formData.net_profit_year3) : null,
          monthly_revenue_6months: monthlyRevenue6MonthsArray,
          audited_financial_statements_url: formData.audited_financial_statements_url ? [formData.audited_financial_statements_url?.uri || formData.audited_financial_statements_url] : null,
          loan_purpose: formData.loan_purpose,
          co_applicant_full_name: formData.co_applicant_full_name,
          co_applicant_relation: formData.co_applicant_relation,
          co_applicant_pan: formData.co_applicant_pan,
          co_applicant_aadhaar: formData.co_applicant_aadhaar,
          co_applicant_contact: formData.co_applicant_contact,
          co_applicant_occupation: formData.co_applicant_occupation,
          co_applicant_annual_income: formData.co_applicant_annual_income ? parseFloat(formData.co_applicant_annual_income) : null,
          co_applicant_cibil_score: formData.co_applicant_cibil_score ? parseInt(formData.co_applicant_cibil_score) : null,
          co_applicant_id_proof_url: formData.co_applicant_id_proof_url?.uri || formData.co_applicant_id_proof_url,
          co_applicant_income_proof_url: formData.co_applicant_income_proof_url?.uri || formData.co_applicant_income_proof_url,
          has_collateral: formData.has_collateral,
          collateral_asset_type: formData.collateral_asset_type,
          collateral_asset_value: formData.collateral_asset_value ? parseFloat(formData.collateral_asset_value) : null,
          collateral_ownership_proof_url: formData.collateral_ownership_proof_url?.uri || formData.collateral_ownership_proof_url,
          collateral_asset_location: formData.collateral_asset_location,
          udyam_registration_url: formData.udyam_registration_url?.uri || formData.udyam_registration_url,
          business_address_proof_url: formData.business_address_proof_url?.uri || formData.business_address_proof_url,
          collateral_documents_url: formData.collateral_documents_url ? [formData.collateral_documents_url?.uri || formData.collateral_documents_url] : null,
          bank_account_holder_name: formData.bank_account_holder_name,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          bank_branch: formData.bank_branch,
          declaration_accepted: formData.declaration_accepted,
          e_signature: formData.e_signature?.uri || formData.e_signature,
          created_at: new Date(),
        };

        const { data, error } = await supabase
          .from('business_loan_applications')
          .insert([businessLoanPayload]);

        if (error) {
          console.error('Supabase error inserting business loan:', error);
          Alert.alert('Error', `Failed to submit business loan application: ${error.message}`);
          setLoading(false);
          return;
        }
      } else {
        // Education loan submission logic
        const educationLoanPayload = {
          user_id: userId,
          full_name: formData.fullName,
          date_of_birth: formData.dob ? new Date(formData.dob) : null,
          gender: formData.gender,
          marital_status: formData.maritalStatus,
          nationality: formData.nationality,
          mobile_number: formData.mobileNumber,
          email_id: formData.emailId,
          permanent_address: formData.permanentAddress,
          current_address: formData.currentAddress,
          aadhaar_number: formData.aadhaarNumber,
          pan_number: formData.panNumber,
          passport_number: formData.passportNumber,
          cibil_score: formData.cibilScore ? parseInt(formData.cibilScore) : null,
          course_name: formData.courseName,
          level_of_study: formData.levelOfStudy,
          mode_of_study: formData.modeOfStudy,
          course_duration: formData.courseDuration,
          institution_name: formData.institutionName,
          institution_type: formData.institutionType,
          institution_address: formData.institutionAddress,
          admission_letter_url: formData.admissionLetter?.uri, // Assuming image upload returns an object with uri
          commencement_date: formData.commencementDate ? new Date(formData.commencementDate) : null,
          completion_date: formData.expectedCompletionDate ? new Date(formData.expectedCompletionDate) : null,
          visa_status: formData.visaStatus,
          total_course_fee: formData.totalCourseFee ? parseFloat(formData.totalCourseFee) : null,
          other_expenses: formData.otherExpenses ? parseFloat(formData.otherExpenses) : null,
          loan_amount: formData.totalLoanAmountRequired ? parseFloat(formData.totalLoanAmountRequired) : null,
          self_contribution: formData.familyContribution ? parseFloat(formData.familyContribution) : null,
          repayment_period: formData.repaymentPeriod ? parseInt(formData.repaymentPeriod) : null,
          moratorium_period: formData.moratoriumPeriod,
          tenth_details: formData.tenthDetails,
          twelfth_details: formData.twelfthDetails,
          graduation_details: formData.graduationDetails,
          competitive_exams: formData.competitiveExams,
          academic_certificates_url: [formData.academicCertificates?.uri], // Assuming image upload returns an object with uri
          employment_status: formData.currentlyEmployed,
          company_name: formData.companyName,
          designation: formData.designation,
          annual_income: formData.annualIncome ? parseFloat(formData.annualIncome) : null,
          work_experience: formData.workExperience ? parseInt(formData.workExperience) : null,
          salary_slips_url: [formData.salarySlips?.uri], // Assuming image upload returns an object with uri
          co_applicant_name: formData.coApplicantFullName,
          co_applicant_relation: formData.coApplicantRelation,
          co_applicant_dob: formData.coApplicantDob ? new Date(formData.coApplicantDob) : null,
          co_applicant_mobile: formData.coApplicantMobileNumber,
          co_applicant_email: formData.coApplicantEmailId,
          co_applicant_occupation: formData.coApplicantOccupation,
          co_applicant_employer: formData.coApplicantEmployerName,
          co_applicant_income: formData.coApplicantAnnualIncome ? parseFloat(formData.coApplicantAnnualIncome) : null,
          co_applicant_pan: formData.coApplicantPanNumber,
          co_applicant_aadhaar: formData.coApplicantAadhaarNumber,
          co_applicant_address_proof_url: formData.coApplicantAddressProof?.uri, // Assuming image upload returns an object with uri
          co_applicant_income_proof_url: formData.coApplicantIncomeProof?.uri, // Assuming image upload returns an object with uri
          co_applicant_cibil_score: formData.coApplicantCibilScore ? parseInt(formData.coApplicantCibilScore) : null,
          movable_assets: formData.movableAssets,
          immovable_assets: formData.immovableAssets,
          existing_loans: formData.existingLoans,
          total_liabilities: formData.totalLiabilities ? parseFloat(formData.totalLiabilities) : null,
          security_offered: formData.securityOffered,
          bank_account_holder_name: formData.accountHolderName,
          bank_name: formData.bankName,
          bank_branch: formData.branch,
          bank_account_number: formData.accountNumber,
          bank_ifsc_code: formData.ifscCode,
          applicant_signature: formData.applicantSignature,
          co_applicant_signature: formData.coApplicantSignature,
          declaration_date: formData.declarationDate ? new Date(formData.declarationDate) : null,
          // fee_structure_url: formData.feeStructure?.uri, // Add if feeStructure is an upload field
          // bank_statements_url: formData.bankStatements?.uri, // Add if bankStatements is an upload field
          // collateral_documents_url: formData.collateralDocuments?.uri // Add if collateralDocuments is an upload field
        };

        const { data, error } = await supabase
          .from('education_loan_applications')
          .insert([educationLoanPayload]);

        if (error) throw error;
      }
      setFormData({});
      setErrors({});
      setLoading(false);
      Alert.alert('Success', 'Application submitted successfully');
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
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
          {loading ? "Submitting..." : `Submit ${activeLoanType === "education" ? "Education" : "Business"} Loan Application`}
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

  const validateEnrollmentForm = () => {
    // Basic validation, extend as needed per enrollment type
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    // Add more specific validations based on activeEnrollmentType if needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateEnrollmentForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields for the selected enrollment type.");
      return;
    }
    setLoading(true);
    Alert.alert("Submit Enrollment", "Enrollment submission logic to be implemented with useFormSubmission hook.");
    // TODO: Implement actual submission logic using a dedicated function in useFormSubmission
    // const userPhone = await AsyncStorage.getItem("userPhone");
    // const userId = await getUserIdByPhone(userPhone);
    // if (!userId) { Alert.alert("Error", "User not found."); setLoading(false); return; }
    // const success = await submitEnrollmentApplication({ userId, enrollmentType: activeEnrollmentType, ...formData });
    // if (success) { ... } else { ... }
    setLoading(false);
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
