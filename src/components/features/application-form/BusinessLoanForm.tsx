import React from 'react';
import { View, Text } from 'react-native'; // Added Text import
import ImageUploadCard from './ImageUploadCard'; // Added ImageUploadCard import
import FormField from './FormField';

interface BusinessLoanFormProps {
    formData: any;
    setFormData: (data: any) => void;
    errors: any;
    setErrors: (errors: any) => void;
}

const BusinessLoanForm: React.FC<BusinessLoanFormProps> = ({ formData, setFormData, errors, setErrors }) => {
    return (
        <View>
            <Text className="text-lg font-semibold text-gray-700 mb-3">Step 1: Applicant/Business Owner Details</Text>
            <FormField
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName || ''}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                error={errors.fullName}
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
                label="PAN Number"
                placeholder="Enter PAN number"
                value={formData.panNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, panNumber: text })}
                error={errors.panNumber}
            />
            <FormField
                label="Aadhaar Number"
                placeholder="Enter Aadhaar number"
                keyboardType="numeric"
                value={formData.aadhaarNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, aadhaarNumber: text })}
                error={errors.aadhaarNumber}
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
                label="Residential Address"
                placeholder="Enter residential address"
                multiline
                value={formData.residentialAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, residentialAddress: text })}
                error={errors.residentialAddress}
            />
            <FormField
                label="Marital Status"
                placeholder="Select Marital Status"
                value={formData.maritalStatus || ''}
                onChangeText={(text) => setFormData({ ...formData, maritalStatus: text })}
                error={errors.maritalStatus}
            />
            <FormField
                label="CIBIL Score (optional)"
                placeholder="Enter CIBIL score"
                keyboardType="numeric"
                value={formData.cibilScore || ''}
                onChangeText={(text) => setFormData({ ...formData, cibilScore: text })}
                error={errors.cibilScore}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 2: Business Details</Text>
            <FormField
                label="Business Name"
                placeholder="Enter business name"
                value={formData.businessName || ''}
                onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                error={errors.businessName}
            />
            <FormField
                label="Business Type"
                placeholder="e.g., Proprietorship, Partnership"
                value={formData.businessType || ''}
                onChangeText={(text) => setFormData({ ...formData, businessType: text })}
                error={errors.businessType}
            />
            <FormField
                label="Year of Incorporation"
                placeholder="YYYY"
                keyboardType="numeric"
                value={formData.yearOfIncorporation || ''}
                onChangeText={(text) => setFormData({ ...formData, yearOfIncorporation: text })}
                error={errors.yearOfIncorporation}
            />
            <FormField
                label="Nature of Business"
                placeholder="e.g., Manufacturing, Services"
                value={formData.natureOfBusiness || ''}
                onChangeText={(text) => setFormData({ ...formData, natureOfBusiness: text })}
                error={errors.natureOfBusiness}
            />
            <FormField
                label="Industry Type"
                placeholder="e.g., FMCG, Textile, SaaS"
                value={formData.industryType || ''}
                onChangeText={(text) => setFormData({ ...formData, industryType: text })}
                error={errors.industryType}
            />
            <FormField
                label="Business PAN Number"
                placeholder="Enter Business PAN number"
                value={formData.businessPanNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, businessPanNumber: text })}
                error={errors.businessPanNumber}
            />
            <FormField
                label="Business Address"
                placeholder="Enter business address"
                multiline
                value={formData.businessAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, businessAddress: text })}
                error={errors.businessAddress}
            />
            <FormField
                label="GSTIN"
                placeholder="Enter GSTIN"
                value={formData.gstin || ''}
                onChangeText={(text) => setFormData({ ...formData, gstin: text })}
                error={errors.gstin}
            />
            <FormField
                label="Udyam Registration Number (optional)"
                placeholder="Enter Udyam Registration Number"
                value={formData.udyamRegistrationNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, udyamRegistrationNumber: text })}
                error={errors.udyamRegistrationNumber}
            />
            <FormField
                label="Website or Social Media (optional)"
                placeholder="Enter website or social media link"
                value={formData.websiteSocialMedia || ''}
                onChangeText={(text) => setFormData({ ...formData, websiteSocialMedia: text })}
                error={errors.websiteSocialMedia}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 3: Business Financials</Text>
            <FormField
                label="Annual Turnover (Last Year)"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={formData.annualTurnover || ''}
                onChangeText={(text) => setFormData({ ...formData, annualTurnover: text })}
                error={errors.annualTurnover}
            />
            <ImageUploadCard
                label="Business Bank Statements (upload PDF)"
                selectedImage={formData.bankStatements}
                onImageSelect={(file) => setFormData({ ...formData, bankStatements: file })}
                error={errors.bankStatements}
            />
            <FormField
                label="Net Profit (Last 3 years)"
                placeholder="Enter net profit for last 3 years"
                value={formData.netProfit || ''}
                onChangeText={(text) => setFormData({ ...formData, netProfit: text })}
                error={errors.netProfit}
            />
            <FormField
                label="Monthly Revenue (last 6 months)"
                placeholder="Enter monthly revenue"
                keyboardType="numeric"
                value={formData.monthlyRevenue || ''}
                onChangeText={(text) => setFormData({ ...formData, monthlyRevenue: text })}
                error={errors.monthlyRevenue}
            />
            <ImageUploadCard
                label="ITR (last 2-3 years) (upload)"
                selectedImage={formData.itrUpload}
                onImageSelect={(file) => setFormData({ ...formData, itrUpload: file })}
                error={errors.itrUpload}
            />
            <ImageUploadCard
                label="Audited Financial Statements (upload)"
                selectedImage={formData.auditedFinancialsUpload}
                onImageSelect={(file) => setFormData({ ...formData, auditedFinancialsUpload: file })}
                error={errors.auditedFinancialsUpload}
            />
            <FormField
                label="Current Loans or Liabilities"
                placeholder="Type, bank, EMI"
                value={formData.currentLoansLiabilities || ''}
                onChangeText={(text) => setFormData({ ...formData, currentLoansLiabilities: text })}
                error={errors.currentLoansLiabilities}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 4: Loan Requirement</Text>
            <FormField
                label="Loan Amount Required"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={formData.loanAmountRequired || ''}
                onChangeText={(text) => setFormData({ ...formData, loanAmountRequired: text })}
                error={errors.loanAmountRequired}
            />
            <FormField
                label="Purpose of Loan"
                placeholder="e.g., Working Capital, Expansion"
                value={formData.purposeOfLoan || ''}
                onChangeText={(text) => setFormData({ ...formData, purposeOfLoan: text })}
                error={errors.purposeOfLoan}
            />
            <FormField
                label="Loan Tenure"
                placeholder="e.g., 6 months - 5 years"
                value={formData.loanTenure || ''}
                onChangeText={(text) => setFormData({ ...formData, loanTenure: text })}
                error={errors.loanTenure}
            />
            <FormField
                label="Preferred EMI (optional)"
                placeholder="Enter preferred EMI amount"
                keyboardType="numeric"
                value={formData.preferredEmi || ''}
                onChangeText={(text) => setFormData({ ...formData, preferredEmi: text })}
                error={errors.preferredEmi}
            />
            <FormField
                label="Expected Disbursement Date"
                placeholder="YYYY-MM-DD"
                value={formData.expectedDisbursementDate || ''}
                onChangeText={(text) => setFormData({ ...formData, expectedDisbursementDate: text })}
                error={errors.expectedDisbursementDate}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 5: Co-Applicant/Guarantor (if any)</Text>
            <FormField
                label="Co-Applicant Full Name"
                placeholder="Enter co-applicant's full name"
                value={formData.coApplicantFullName || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantFullName: text })}
                error={errors.coApplicantFullName}
            />
            <FormField
                label="Relation to Applicant"
                placeholder="e.g., Spouse, Partner"
                value={formData.coApplicantRelation || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantRelation: text })}
                error={errors.coApplicantRelation}
            />
            <FormField
                label="Co-Applicant PAN / Aadhaar"
                placeholder="Enter PAN or Aadhaar"
                value={formData.coApplicantPanAadhaar || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantPanAadhaar: text })}
                error={errors.coApplicantPanAadhaar}
            />
            <FormField
                label="Co-Applicant Contact Number"
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                value={formData.coApplicantContactNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantContactNumber: text })}
                error={errors.coApplicantContactNumber}
            />
            <FormField
                label="Co-Applicant Occupation"
                placeholder="Enter occupation"
                value={formData.coApplicantOccupation || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantOccupation: text })}
                error={errors.coApplicantOccupation}
            />
            <FormField
                label="Co-Applicant Annual Income"
                placeholder="Enter annual income"
                keyboardType="numeric"
                value={formData.coApplicantAnnualIncome || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantAnnualIncome: text })}
                error={errors.coApplicantAnnualIncome}
            />
            <FormField
                label="Co-Applicant CIBIL Score (if known)"
                placeholder="Enter CIBIL score"
                keyboardType="numeric"
                value={formData.coApplicantCibilScore || ''}
                onChangeText={(text) => setFormData({ ...formData, coApplicantCibilScore: text })}
                error={errors.coApplicantCibilScore}
            />
            <ImageUploadCard
                label="Co-Applicant ID Proof / Income Proof (upload)"
                selectedImage={formData.coApplicantProofUpload}
                onImageSelect={(file) => setFormData({ ...formData, coApplicantProofUpload: file })}
                error={errors.coApplicantProofUpload}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 6: Collateral (Optional / Required for Secured Loans)</Text>
            <FormField
                label="Do you have collateral?"
                placeholder="Yes/No"
                value={formData.hasCollateral || ''} /* Assuming a string 'Yes' or 'No' for simplicity, can be a boolean state */
                onChangeText={(text) => setFormData({ ...formData, hasCollateral: text })}
                error={errors.hasCollateral}
            />
            {/* Conditional rendering for collateral details can be added here based on formData.hasCollateral */}
            <FormField
                label="Asset Type (if collateral)"
                placeholder="e.g., Property, Machinery, FD"
                value={formData.collateralAssetType || ''}
                onChangeText={(text) => setFormData({ ...formData, collateralAssetType: text })}
                error={errors.collateralAssetType}
            />
            <FormField
                label="Asset Value (if collateral)"
                placeholder="Enter asset value"
                keyboardType="numeric"
                value={formData.collateralAssetValue || ''}
                onChangeText={(text) => setFormData({ ...formData, collateralAssetValue: text })}
                error={errors.collateralAssetValue}
            />
            <ImageUploadCard
                label="Ownership Proof (upload documents - if collateral)"
                selectedImage={formData.collateralOwnershipProof}
                onImageSelect={(file) => setFormData({ ...formData, collateralOwnershipProof: file })}
                error={errors.collateralOwnershipProof}
            />
            <FormField
                label="Location of Asset (if property collateral)"
                placeholder="Enter asset location"
                value={formData.collateralAssetLocation || ''}
                onChangeText={(text) => setFormData({ ...formData, collateralAssetLocation: text })}
                error={errors.collateralAssetLocation}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 7: Business Documents Upload</Text>
            <ImageUploadCard
                label="PAN (Business & Owner)"
                selectedImage={formData.panUpload}
                onImageSelect={(file) => setFormData({ ...formData, panUpload: file })}
                error={errors.panUpload}
            />
            <ImageUploadCard
                label="Aadhaar (Owner)"
                selectedImage={formData.aadhaarUpload}
                onImageSelect={(file) => setFormData({ ...formData, aadhaarUpload: file })}
                error={errors.aadhaarUpload}
            />
            <ImageUploadCard
                label="GST Certificate"
                selectedImage={formData.gstCertificate}
                onImageSelect={(file) => setFormData({ ...formData, gstCertificate: file })}
                error={errors.gstCertificate}
            />
            <ImageUploadCard
                label="Udyam Registration (if any)"
                selectedImage={formData.udyamRegistrationUpload}
                onImageSelect={(file) => setFormData({ ...formData, udyamRegistrationUpload: file })}
                error={errors.udyamRegistrationUpload}
            />
            <ImageUploadCard
                label="Business Address Proof"
                selectedImage={formData.businessAddressProofUpload}
                onImageSelect={(file) => setFormData({ ...formData, businessAddressProofUpload: file })}
                error={errors.businessAddressProofUpload}
            />
            {/* Note: Audited Financials and ITR are already in Step 3, Bank Statements in Step 3 */}
            {/* Collateral Documents are part of Step 6 if collateral is provided */}
            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 8: Bank Details</Text>
            <FormField
                label="Bank Account Holder Name"
                placeholder="Enter account holder name"
                value={formData.bankAccountHolderName || ''}
                onChangeText={(text) => setFormData({ ...formData, bankAccountHolderName: text })}
                error={errors.bankAccountHolderName}
            />
            <FormField
                label="Bank Name"
                placeholder="Enter bank name"
                value={formData.bankName || ''}
                onChangeText={(text) => setFormData({ ...formData, bankName: text })}
                error={errors.bankName}
            />
            <FormField
                label="Account Number"
                placeholder="Enter account number"
                keyboardType="numeric"
                value={formData.accountNumberBusiness || ''} /* Renamed to avoid conflict if personal account number exists */
                onChangeText={(text) => setFormData({ ...formData, accountNumberBusiness: text })}
                error={errors.accountNumberBusiness}
            />
            <FormField
                label="IFSC Code"
                placeholder="Enter IFSC code"
                value={formData.ifscCodeBusiness || ''} /* Renamed to avoid conflict */
                onChangeText={(text) => setFormData({ ...formData, ifscCodeBusiness: text })}
                error={errors.ifscCodeBusiness}
            />
            <FormField
                label="Branch"
                placeholder="Enter branch name"
                value={formData.branchBusiness || ''} /* Renamed to avoid conflict */
                onChangeText={(text) => setFormData({ ...formData, branchBusiness: text })}
                error={errors.branchBusiness}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 9: Review & Declaration</Text>
            {/* Review All Entered Data (collapsible sections) - This would typically be a UI feature, not a simple form field */}
            {/* For now, we'll add a placeholder for the declaration */}
            <View className="flex-row items-center my-4">
                {/* This would be a Checkbox component in a real app */}
                <View className={`w-6 h-6 border-2 rounded mr-2 ${formData.declarationAccepted ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`} />
                <Text
                    className="flex-1 text-gray-700"
                    onPress={() => setFormData({ ...formData, declarationAccepted: !formData.declarationAccepted })}
                >
                    I confirm all details are accurate and consent to credit checks and data verification by the lending institution.
                </Text>
            </View>
            {errors.declarationAccepted && <Text className="text-red-500 text-xs mt-1">{errors.declarationAccepted}</Text>}
            {/* E-signature or Consent Submit Button would be part of the parent screen's submit logic */}
        </View>
    );
};

export default BusinessLoanForm;
