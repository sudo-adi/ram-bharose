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
      if (!formData.fullName) newErrors.fullName = "Full Name is required";
      if (!formData.dob) newErrors.dob = "Date of Birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.maritalStatus) newErrors.maritalStatus = "Marital Status is required";
      if (!formData.nationality) newErrors.nationality = "Nationality is required";
      if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile Number is required";
      if (!formData.emailId) newErrors.emailId = "Email ID is required";
      if (!formData.permanentAddress) newErrors.permanentAddress = "Permanent Address is required";
      if (!formData.currentAddress) newErrors.currentAddress = "Current Address is required";
      if (!formData.aadhaarNumber) newErrors.aadhaarNumber = "Aadhaar Number is required";
      if (!formData.panNumber) newErrors.panNumber = "PAN Number is required";

      // Section 2: Course & Institution Details
      if (!formData.courseName) newErrors.courseName = "Course Name is required";
      if (!formData.levelOfStudy) newErrors.levelOfStudy = "Level of Study is required";
      if (!formData.modeOfStudy) newErrors.modeOfStudy = "Mode of Study is required";
      if (!formData.courseDuration) newErrors.courseDuration = "Course Duration is required";
      if (!formData.institutionName) newErrors.institutionName = "Institution Name is required";
      if (!formData.institutionType) newErrors.institutionType = "Institution Type is required";
      if (!formData.institutionAddress) newErrors.institutionAddress = "Institution Address is required";
      if (!formData.admissionLetter) newErrors.admissionLetter = "Admission Letter is required";
      if (!formData.commencementDate) newErrors.commencementDate = "Commencement Date is required";
      if (!formData.expectedCompletionDate) newErrors.expectedCompletionDate = "Expected Completion Date is required";

      // Section 3: Loan Requirement
      if (!formData.totalCourseFee) newErrors.totalCourseFee = "Total Course Fee is required";
      if (!formData.totalLoanAmountRequired) newErrors.totalLoanAmountRequired = "Total Loan Amount Required is required";
      if (!formData.repaymentPeriod) newErrors.repaymentPeriod = "Repayment Period is required";

      // Section 4: Academic Background
      if (!formData.tenthDetails) newErrors.tenthDetails = "10th Details are required";
      if (!formData.twelfthDetails) newErrors.twelfthDetails = "12th Details are required";
      if (!formData.academicCertificates) newErrors.academicCertificates = "Academic Certificates are required";

      // Section 6: Co-applicant/Guarantor Details (Mandatory)
      if (!formData.coApplicantFullName) newErrors.coApplicantFullName = "Co-applicant Full Name is required";
      if (!formData.coApplicantRelation) newErrors.coApplicantRelation = "Co-applicant Relation is required";
      if (!formData.coApplicantDob) newErrors.coApplicantDob = "Co-applicant Date of Birth is required";
      if (!formData.coApplicantMobileNumber) newErrors.coApplicantMobileNumber = "Co-applicant Mobile Number is required";
      if (!formData.coApplicantEmailId) newErrors.coApplicantEmailId = "Co-applicant Email ID is required";
      if (!formData.coApplicantOccupation) newErrors.coApplicantOccupation = "Co-applicant Occupation is required";
      if (!formData.coApplicantAnnualIncome) newErrors.coApplicantAnnualIncome = "Co-applicant Annual Income is required";
      if (!formData.coApplicantPanNumber) newErrors.coApplicantPanNumber = "Co-applicant PAN Number is required";
      if (!formData.coApplicantAadhaarNumber) newErrors.coApplicantAadhaarNumber = "Co-applicant Aadhaar Number is required";
      if (!formData.coApplicantAddressProof) newErrors.coApplicantAddressProof = "Co-applicant Address Proof is required";
      if (!formData.coApplicantIncomeProof) newErrors.coApplicantIncomeProof = "Co-applicant Income Proof is required";

      // Section 8: Bank Account Details
      if (!formData.accountHolderName) newErrors.accountHolderName = "Account Holder Name is required";
      if (!formData.bankName) newErrors.bankName = "Bank Name is required";
      if (!formData.branch) newErrors.branch = "Branch is required";
      if (!formData.accountNumber) newErrors.accountNumber = "Account Number is required";
      if (!formData.ifscCode) newErrors.ifscCode = "IFSC Code is required";

      // Declaration
      if (!formData.applicantSignature) newErrors.applicantSignature = "Applicant Signature is required";
      if (!formData.coApplicantSignature) newErrors.coApplicantSignature = "Co-applicant Signature is required";
      if (!formData.declarationDate) newErrors.declarationDate = "Declaration Date is required";

    } else if (activeLoanType === "business") {
      if (!formData.fullName) newErrors.fullName = "Full name ";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth ";
      if (!formData.gender) newErrors.gender = "Gender ";
      if (!formData.residentialAddress) newErrors.residentialAddress = "Residential address ";
      if (!formData.maritalStatus) newErrors.maritalStatus = "Marital status ";
      if (!formData.panNumber) newErrors.panNumber = "PAN number ";
      if (!formData.aadhaarNumber) newErrors.aadhaarNumber = "Aadhaar number ";
      if (!formData.businessName) newErrors.businessName = "Business name ";
      if (!formData.natureOfBusiness) newErrors.natureOfBusiness = "Nature of business ";
      if (!formData.industryType) newErrors.industryType = "Industry type ";
      if (!formData.businessPAN) newErrors.businessPAN = "Business PAN ";
      if (!formData.gstin) newErrors.gstin = "GSTIN ";
      if (!formData.businessAddress) newErrors.businessAddress = "Business address ";
      if (!formData.annualTurnover) newErrors.annualTurnover = "Annual turnover ";
      if (!formData.netProfit) newErrors.netProfit = "Net profit ";
      if (!formData.monthlyRevenue) newErrors.monthlyRevenue = "Monthly revenue ";
      if (!formData.loanAmount) newErrors.loanAmount = "Loan amount ";
      if (!formData.loanTenure) newErrors.loanTenure = "Loan tenure ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateLoanForm()) {
      Alert.alert("Please fill in the following values: ", Object.values(errors).join('\n'));
      return;
    }

    setLoading(true);
    try {
      const userPhone = await AsyncStorage.getItem('userPhone');
      const userId = await getUserIdByPhone(userPhone);

      if (!userId) {
        Alert.alert('Error', 'User not found. Please login again.');
        return;
      }

      if (activeLoanType === "business") {
        const { data, error } = await supabase
          .from('business_loan_applications')
          .insert([{
            user_id: userId,
            full_name: formData.fullName,
            date_of_birth: new Date(formData.dob),
            gender: formData.gender,
            residential_address: formData.address,
            marital_status: formData.maritalStatus,
            cibil_score: parseInt(formData.cibilScore),
            pan_number: formData.panNumber,
            aadhaar_number: formData.aadhaarNumber,
            business_name: formData.businessName,
            nature_of_business: formData.businessNature,
            industry_type: formData.industryType,
            business_pan: formData.businessPAN,
            gstin: formData.gstin,
            business_address: formData.businessAddress,
            udyam_registration: formData.udyamRegistration,
            website_url: formData.website,
            annual_turnover: parseFloat(formData.annualTurnover),
            net_profit: parseFloat(formData.netProfit),
            monthly_revenue: parseFloat(formData.monthlyRevenue),
            current_liabilities: parseFloat(formData.liabilities),
            loan_amount: parseFloat(formData.loanAmount),
            loan_tenure: parseInt(formData.loanTenure),
            preferred_emi: parseFloat(formData.preferredEMI),
            disbursement_date: new Date(formData.disbursementDate),
            bank_statements_url: formData.bankStatements,
            itr_documents_url: formData.itrDocuments,
            pan_card_url: formData.panCard,
            aadhaar_card_url: formData.aadhaarCard,
            gst_certificate_url: formData.gstCertificate
          }]);

        if (error) throw error;
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
