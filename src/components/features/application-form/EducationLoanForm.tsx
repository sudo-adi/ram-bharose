import React from 'react';
import { View, Text } from 'react-native'; // Added Text import
import ImageUploadCard from './ImageUploadCard'; // Added ImageUploadCard import
import FormField from './FormField';

interface EducationLoanFormProps {
    formData: any;
    setFormData: (data: any) => void;
    errors: any;
    setErrors: (errors: any) => void;
}

const EducationLoanForm: React.FC<EducationLoanFormProps> = ({ formData, setFormData, errors, setErrors }) => {
    return (
        <View>
            <Text className="text-lg font-semibold text-gray-700 mb-3">Section 1: Applicant Personal Details</Text>
            <FormField
                label="Full Name (as per Aadhaar/PAN)"
                placeholder="Enter your full name"
                value={formData.fullName || ''}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                error={errors.fullName}
            />
            <FormField
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={formData.dob || ''}
                onChangeText={(text) => setFormData({ ...formData, dob: text })}
                error={errors.dob}
            />
            <FormField
                label="Gender"
                placeholder="Select Gender"
                value={formData.gender || ''}
                onChangeText={(text) => setFormData({ ...formData, gender: text })}
                error={errors.gender}
            />
            <FormField
                label="Marital Status"
                placeholder="Select Marital Status"
                value={formData.maritalStatus || ''}
                onChangeText={(text) => setFormData({ ...formData, maritalStatus: text })}
                error={errors.maritalStatus}
            />
            <FormField
                label="Nationality"
                placeholder="Enter your nationality"
                value={formData.nationality || ''}
                onChangeText={(text) => setFormData({ ...formData, nationality: text })}
                error={errors.nationality}
            />
            <FormField
                label="Mobile Number"
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                value={formData.mobileNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
                error={errors.mobileNumber}
            />
            <FormField
                label="Email ID"
                placeholder="Enter your email address"
                keyboardType="email-address"
                value={formData.emailId || ''}
                onChangeText={(text) => setFormData({ ...formData, emailId: text })}
                error={errors.emailId}
            />
            <FormField
                label="Permanent Address"
                placeholder="Enter permanent address"
                multiline
                value={formData.permanentAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, permanentAddress: text })}
                error={errors.permanentAddress}
            />
            <FormField
                label="Current Address"
                placeholder="Enter current address (if different from permanent)"
                multiline
                value={formData.currentAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, currentAddress: text })}
                error={errors.currentAddress}
            />
            <FormField
                label="Aadhaar Number"
                placeholder="Enter your Aadhaar number"
                keyboardType="numeric"
                value={formData.aadhaarNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, aadhaarNumber: text })}
                error={errors.aadhaarNumber}
            />
            <FormField
                label="PAN Number"
                placeholder="Enter your PAN number"
                value={formData.panNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, panNumber: text })}
                error={errors.panNumber}
            />
            <FormField
                label="Passport Number (if available)"
                placeholder="Enter passport number"
                value={formData.passportNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, passportNumber: text })}
                error={errors.passportNumber}
            />
            <FormField
                label="CIBIL Score (if known)"
                placeholder="Enter CIBIL score"
                keyboardType="numeric"
                value={formData.cibilScore || ''}
                onChangeText={(text) => setFormData({ ...formData, cibilScore: text })}
                error={errors.cibilScore}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 2: Course & Institution Details</Text>
            <FormField
                label="Course Name"
                placeholder="Enter course name"
                value={formData.courseName || ''}
                onChangeText={(text) => setFormData({ ...formData, courseName: text })}
                error={errors.courseName}
            />
            <FormField
                label="Institution Name"
                placeholder="Enter institution name"
                value={formData.institutionName || ''}
                onChangeText={(text) => setFormData({ ...formData, institutionName: text })}
                error={errors.institutionName}
            />
            <FormField
                label="Level of Study"
                placeholder="e.g., UG/PG/Diploma/PhD"
                value={formData.levelOfStudy || ''}
                onChangeText={(text) => setFormData({ ...formData, levelOfStudy: text })}
                error={errors.levelOfStudy}
            />
            <FormField
                label="Mode of Study"
                placeholder="e.g., Full-time/Part-time/Distance"
                value={formData.modeOfStudy || ''}
                onChangeText={(text) => setFormData({ ...formData, modeOfStudy: text })}
                error={errors.modeOfStudy}
            />
            <FormField
                label="Course Duration"
                placeholder="e.g., 4 years"
                value={formData.courseDuration || ''}
                onChangeText={(text) => setFormData({ ...formData, courseDuration: text })}
                error={errors.courseDuration}
            />
            <FormField
                label="Institution Type"
                placeholder="e.g., India/Abroad"
                value={formData.institutionType || ''}
                onChangeText={(text) => setFormData({ ...formData, institutionType: text })}
                error={errors.institutionType}
            />
            <FormField
                label="Institution Address"
                placeholder="Enter institution address"
                multiline
                value={formData.institutionAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, institutionAddress: text })}
                error={errors.institutionAddress}
            />
            <ImageUploadCard
                label="Admission Letter (upload)"
                selectedImage={formData.admissionLetter}
                onImageSelect={(file) => setFormData({ ...formData, admissionLetter: file })}
                error={errors.admissionLetter}
            />
            <FormField
                label="Commencement Date"
                placeholder="YYYY-MM-DD"
                value={formData.commencementDate || ''}
                onChangeText={(text) => setFormData({ ...formData, commencementDate: text })}
                error={errors.commencementDate}
            />
            <FormField
                label="Expected Completion Date"
                placeholder="YYYY-MM-DD"
                value={formData.expectedCompletionDate || ''}
                onChangeText={(text) => setFormData({ ...formData, expectedCompletionDate: text })}
                error={errors.expectedCompletionDate}
            />
            <FormField
                label="Visa Status (for overseas)"
                placeholder="Enter visa status"
                value={formData.visaStatus || ''}
                onChangeText={(text) => setFormData({ ...formData, visaStatus: text })}
                error={errors.visaStatus}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 3: Loan Requirement</Text>
            <FormField
                label="Total Course Fee"
                placeholder="Enter total course fee"
                keyboardType="numeric"
                value={formData.totalCourseFee || ''}
                onChangeText={(text) => setFormData({ ...formData, totalCourseFee: text })}
                error={errors.totalCourseFee}
            />
            <FormField
                label="Other Expenses (Accommodation, Travel, Books, etc.)"
                placeholder="Enter other expenses amount"
                keyboardType="numeric"
                value={formData.otherExpenses || ''}
                onChangeText={(text) => setFormData({ ...formData, otherExpenses: text })}
                error={errors.otherExpenses}
            />
            <FormField
                label="Total Loan Amount Required"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={formData.loanAmountRequired || ''}
                onChangeText={(text) => setFormData({ ...formData, loanAmountRequired: text })}
                error={errors.loanAmountRequired}
            />
            <FormField
                label="Contribution from Family/Self"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={formData.familyContribution || ''}
                onChangeText={(text) => setFormData({ ...formData, familyContribution: text })}
                error={errors.familyContribution}
            />
            <FormField
                label="Repayment Period (in years)"
                placeholder="e.g., 5 years"
                keyboardType="numeric"
                value={formData.repaymentPeriod || ''}
                onChangeText={(text) => setFormData({ ...formData, repaymentPeriod: text })}
                error={errors.repaymentPeriod}
            />
            <FormField
                label="Moratorium Period (if required)"
                placeholder="e.g., 6 months"
                value={formData.moratoriumPeriod || ''}
                onChangeText={(text) => setFormData({ ...formData, moratoriumPeriod: text })}
                error={errors.moratoriumPeriod}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 4: Academic Background</Text>
            <FormField
                label="10th Board Name / Year / Marks"
                placeholder="e.g., CBSE / 2015 / 90%"
                value={formData.academic10th || ''}
                onChangeText={(text) => setFormData({ ...formData, academic10th: text })}
                error={errors.academic10th}
            />
            <FormField
                label="12th Board Name / Year / Marks"
                placeholder="e.g., State Board / 2017 / 85%"
                value={formData.academic12th || ''}
                onChangeText={(text) => setFormData({ ...formData, academic12th: text })}
                error={errors.academic12th}
            />
            <FormField
                label="Graduation Details (if applicable)"
                placeholder="e.g., B.Tech CSE / 2021 / 8.5 CGPA"
                value={formData.graduationDetails || ''}
                onChangeText={(text) => setFormData({ ...formData, graduationDetails: text })}
                error={errors.graduationDetails}
            />
            <FormField
                label="Competitive Exams Cleared (e.g., GRE/GMAT/IELTS)"
                placeholder="Enter exam name and score"
                value={formData.competitiveExams || ''}
                onChangeText={(text) => setFormData({ ...formData, competitiveExams: text })}
                error={errors.competitiveExams}
            />
            <ImageUploadCard
                label="Academic Certificates (upload)"
                selectedImage={formData.academicCertificates}
                onImageSelect={(file) => setFormData({ ...formData, academicCertificates: file })}
                error={errors.academicCertificates}
            />
            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 5: Employment Details (If Applicable)</Text>
            <FormField
                label="Currently Employed?"
                placeholder="Yes/No"
                value={formData.currentlyEmployed || ''}
                onChangeText={(text) => setFormData({ ...formData, currentlyEmployed: text })}
                error={errors.currentlyEmployed}
            />
            <FormField
                label="Company Name"
                placeholder="Enter company name"
                value={formData.companyName || ''}
                onChangeText={(text) => setFormData({ ...formData, companyName: text })}
                error={errors.companyName}
            />
            <FormField
                label="Designation"
                placeholder="Enter designation"
                value={formData.designation || ''}
                onChangeText={(text) => setFormData({ ...formData, designation: text })}
                error={errors.designation}
            />
            <FormField
                label="Annual Income"
                placeholder="Enter annual income"
                keyboardType="numeric"
                value={formData.annualIncome || ''}
                onChangeText={(text) => setFormData({ ...formData, annualIncome: text })}
                error={errors.annualIncome}
            />
            <FormField
                label="Work Experience (in years)"
                placeholder="Enter work experience"
                keyboardType="numeric"
                value={formData.workExperience || ''}
                onChangeText={(text) => setFormData({ ...formData, workExperience: text })}
                error={errors.workExperience}
            />
            <ImageUploadCard
                label="Salary Slips / ITR / Form 16 (upload)"
                selectedImage={formData.incomeProofApplicant}
                onImageSelect={(file) => setFormData({ ...formData, incomeProofApplicant: file })}
                error={errors.incomeProofApplicant}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 6: Co-applicant/Guarantor Details (Mandatory)</Text>
            <FormField
                label="Co-applicant Full Name"
                placeholder="Enter co-applicant's full name"
                value={formData.coApplicantFullName || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantFullName: text })}
                error={errors.coApplicantFullName}
            />
            <FormField
                label="Relation to Applicant"
                placeholder="e.g., Father, Mother"
                value={formData.coApplicantRelation || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantRelation: text })}
                error={errors.coApplicantRelation}
            />
            <FormField
                label="Co-applicant Date of Birth"
                placeholder="YYYY-MM-DD"
                value={formData.coApplicantDob || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantDob: text })}
                error={errors.coApplicantDob}
            />
            <FormField
                label="Co-applicant Mobile Number"
                placeholder="Enter co-applicant's mobile number"
                keyboardType="phone-pad"
                value={formData.coApplicantMobileNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantMobileNumber: text })}
                error={errors.coApplicantMobileNumber}
            />
            <FormField
                label="Co-applicant Email ID"
                placeholder="Enter co-applicant's email address"
                keyboardType="email-address"
                value={formData.coApplicantEmailId || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantEmailId: text })}
                error={errors.coApplicantEmailId}
            />
            <FormField
                label="Co-applicant Occupation"
                placeholder="Enter co-applicant's occupation"
                value={formData.coApplicantOccupation || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantOccupation: text })}
                error={errors.coApplicantOccupation}
            />
            <FormField
                label="Co-applicant Employer Name"
                placeholder="Enter co-applicant's employer name"
                value={formData.coApplicantEmployerName || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantEmployerName: text })}
                error={errors.coApplicantEmployerName}
            />
            <FormField
                label="Co-applicant Annual Income"
                placeholder="Enter co-applicant's annual income"
                keyboardType="numeric"
                value={formData.coApplicantAnnualIncome || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantAnnualIncome: text })}
                error={errors.coApplicantAnnualIncome}
            />
            <FormField
                label="Co-applicant PAN Number"
                placeholder="Enter co-applicant's PAN number"
                value={formData.coApplicantPanNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantPanNumber: text })}
                error={errors.coApplicantPanNumber}
            />
            <FormField
                label="Co-applicant Aadhaar Number"
                placeholder="Enter co-applicant's Aadhaar number"
                keyboardType="numeric"
                value={formData.coApplicantAadhaarNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantAadhaarNumber: text })}
                error={errors.coApplicantAadhaarNumber}
            />
            <ImageUploadCard
                label="Co-applicant Address Proof (upload)"
                selectedImage={formData.coApplicantAddressProof}
                onImageSelect={(file) => setFormData({ ...formData, coApplicantAddressProof: file })}
                error={errors.coApplicantAddressProof}
            />
            <ImageUploadCard
                label="Co-applicant Income Proof (ITR/Form16/Salary Slips)"
                selectedImage={formData.coApplicantIncomeProof}
                onImageSelect={(file) => setFormData({ ...formData, coApplicantIncomeProof: file })}
                error={errors.coApplicantIncomeProof}
            />
            <FormField
                label="Co-applicant CIBIL Score (if known)"
                placeholder="Enter co-applicant's CIBIL score"
                keyboardType="numeric"
                value={formData.coApplicantCibilScore || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantCibilScore: text })}
                error={errors.coApplicantCibilScore}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 7: Asset & Liability Details</Text>
            <FormField
                label="Movable Assets (FDs, Shares, etc.)"
                placeholder="Enter details of movable assets"
                value={formData.movableAssets || ''}
                onChangeText={(text) => setFormData({ ...formData, movableAssets: text })}
                error={errors.movableAssets}
            />
            <FormField
                label="Immovable Assets (Land, Property)"
                placeholder="Enter details of immovable assets"
                value={formData.immovableAssets || ''}
                onChangeText={(text) => setFormData({ ...formData, immovableAssets: text })}
                error={errors.immovableAssets}
            />
            <FormField
                label="Existing Loans (if any)"
                placeholder="Enter details of existing loans"
                value={formData.existingLoans || ''}
                onChangeText={(text) => setFormData({ ...formData, existingLoans: text })}
                error={errors.existingLoans}
            />
            <FormField
                label="Total Liabilities"
                placeholder="Enter total liabilities amount"
                value={formData.totalLiabilities || ''}
                onChangeText={(text) => setFormData({ ...formData, totalLiabilities: text })}
                error={errors.totalLiabilities}
            />
            <FormField
                label="Security Offered (if any)"
                placeholder="e.g., Collateral/Property/FD/Third Party Guarantee"
                value={formData.securityOffered || ''}
                onChangeText={(text) => setFormData({ ...formData, securityOffered: text })}
                error={errors.securityOffered}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 8: Bank Account Details</Text>
            <FormField
                label="Account Holder Name"
                placeholder="Enter account holder name"
                value={formData.accountHolderName || ''}
                onChangeText={(text) => setFormData({ ...formData, accountHolderName: text })}
                error={errors.accountHolderName}
            />
            <FormField
                label="Bank Name"
                placeholder="Enter bank name"
                value={formData.bankName || ''}
                onChangeText={(text) => setFormData({ ...formData, bankName: text })}
                error={errors.bankName}
            />
            <FormField
                label="Branch"
                placeholder="Enter branch name"
                value={formData.branch || ''}
                onChangeText={(text) => setFormData({ ...formData, branch: text })}
                error={errors.branch}
            />
            <FormField
                label="Account Number"
                placeholder="Enter account number"
                keyboardType="numeric"
                value={formData.accountNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
                error={errors.accountNumber}
            />
            <FormField
                label="IFSC Code"
                placeholder="Enter IFSC code"
                value={formData.ifscCode || ''}
                onChangeText={(text) => setFormData({ ...formData, ifscCode: text })}
                error={errors.ifscCode}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 9: Document Checklist & Uploads</Text>
            <ImageUploadCard
                label="Photo ID (PAN/Aadhaar/Passport - Applicant)"
                selectedImage={formData.applicantPhotoId}
                onImageSelect={(file) => setFormData({ ...formData, applicantPhotoId: file })}
                error={errors.applicantPhotoId}
            />
            <ImageUploadCard
                label="Address Proof (Applicant)"
                selectedImage={formData.applicantAddressProof}
                onImageSelect={(file) => setFormData({ ...formData, applicantAddressProof: file })}
                error={errors.applicantAddressProof}
            />
            <ImageUploadCard
                label="Fee Structure from Institution (upload)"
                selectedImage={formData.feeStructure}
                onImageSelect={(file) => setFormData({ ...formData, feeStructure: file })}
                error={errors.feeStructure}
            />
            <ImageUploadCard
                label="Bank Statements (Last 6 months - Applicant)"
                selectedImage={formData.applicantBankStatements}
                onImageSelect={(file) => setFormData({ ...formData, applicantBankStatements: file })}
                error={errors.applicantBankStatements}
            />
            <ImageUploadCard
                label="Passport & Visa (if applicable)"
                selectedImage={formData.passportVisaUpload}
                onImageSelect={(file) => setFormData({ ...formData, passportVisaUpload: file })}
                error={errors.passportVisaUpload}
            />
            <ImageUploadCard
                label="Collateral Documents (if secured loan)"
                selectedImage={formData.collateralDocuments}
                onImageSelect={(file) => setFormData({ ...formData, collateralDocuments: file })}
                error={errors.collateralDocuments}
            />
        </View>
    );
};

export default EducationLoanForm;
