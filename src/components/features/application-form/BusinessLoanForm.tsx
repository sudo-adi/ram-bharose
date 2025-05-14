import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageUploadCard from './ImageUploadCard';
import FormField from './FormField';

interface BusinessLoanFormProps {
    formData: any;
    setFormData: (data: any) => void;
    errors: any;
    setErrors: (errors: any) => void;
}

const BusinessLoanForm: React.FC<BusinessLoanFormProps> = ({ formData, setFormData, errors, setErrors }) => {
    // Add test data function
    const fillTestData = () => {
        const testData = {
            full_name: "Test Business Owner",
            date_of_birth: "1980-01-01",
            gender: "Male",
            residential_address: "123 Test Street, Test City",
            marital_status: "Married",
            cibil_score: 750,
            pan_number: "ABCDE1234F",
            aadhaar_number: "123456789012",
            email: "test@business.com",
            mobile_number: "9876543210",
            business_name: "Test Enterprise",
            nature_of_business: "Manufacturing",
            industry_type: "Electronics",
            business_pan: "FGHIJ5678K",
            gstin: "22AAAAA0000A1Z5",
            business_address: "456 Business Park, Industrial Area",
            udyam_registration: "UDYAM-XX-00-0000000",
            website_url: "www.testbusiness.com",
            business_type: "Proprietorship",
            year_of_incorporation: "2015-01-01",
            annual_turnover: 5000000,
            net_profit: 1000000,
            monthly_revenue: 400000,
            current_liabilities: 2000000,
            annual_turnover_year1: 4500000,
            annual_turnover_year2: 4000000,
            annual_turnover_year3: 3500000,
            net_profit_year1: 900000,
            net_profit_year2: 800000,
            net_profit_year3: 700000,
            monthly_revenue_6months: [350000, 380000, 400000, 420000, 390000, 400000],
            loan_amount: 2000000,
            loan_tenure: 36,
            preferred_emi: 65000,
            disbursement_date: "2024-02-01",
            loan_purpose: "Business Expansion",
            co_applicant_full_name: "Test Co-applicant",
            co_applicant_relation: "Spouse",
            co_applicant_pan: "LMNOP9012Q",
            co_applicant_aadhaar: "987654321012",
            co_applicant_contact: "9876543211",
            co_applicant_occupation: "Business Partner",
            co_applicant_annual_income: 1200000,
            co_applicant_cibil_score: 780,
            has_collateral: true,
            collateral_asset_type: "Commercial Property",
            collateral_asset_value: 5000000,
            collateral_asset_location: "789 Property Location, Test City",
            bank_account_holder_name: "Test Business Owner",
            bank_name: "Test Bank",
            account_number: "1234567890",
            ifsc_code: "TEST0001234",
            bank_branch: "Test Branch",
            declaration_accepted: true,
            e_signature: "Test Business Owner"
        };
        setFormData({ ...formData, ...testData });
    };

    return (
        <View>
            {/* <TouchableOpacity
                onPress={fillTestData}
                className="bg-gray-200 py-2 px-4 rounded-lg mb-4"
            >
                <Text className="text-gray-700 text-center">Fill Test Data</Text>
            </TouchableOpacity> */}
            <View>
                <Text className="text-lg font-semibold text-gray-700 mb-3">Step 1: Applicant Personal Details</Text>
                <FormField
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.full_name || ''}
                    onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                    error={errors.full_name}
                />
                <FormField
                    label="Date of Birth"
                    placeholder="YYYY-MM-DD"
                    value={formData.date_of_birth || ''}
                    onChangeText={(text) => setFormData({ ...formData, date_of_birth: text })}
                    error={errors.date_of_birth}
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
                    placeholder="Enter your residential address"
                    multiline
                    value={formData.residential_address || ''}
                    onChangeText={(text) => setFormData({ ...formData, residential_address: text })}
                    error={errors.residential_address}
                />
                <FormField
                    label="Marital Status"
                    placeholder="Select Marital Status"
                    value={formData.marital_status || ''}
                    onChangeText={(text) => setFormData({ ...formData, marital_status: text })}
                    error={errors.marital_status}
                />
                <FormField
                    label="CIBIL Score"
                    placeholder="Enter your CIBIL score"
                    keyboardType="numeric"
                    value={formData.cibil_score || ''}
                    onChangeText={(text) => setFormData({ ...formData, cibil_score: text })}
                    error={errors.cibil_score}
                />
                <FormField
                    label="PAN Number"
                    placeholder="Enter your PAN number"
                    value={formData.pan_number || ''}
                    onChangeText={(text) => setFormData({ ...formData, pan_number: text })}
                    error={errors.pan_number}
                />
                <FormField
                    label="Aadhaar Number"
                    placeholder="Enter your Aadhaar number"
                    keyboardType="numeric"
                    value={formData.aadhaar_number || ''}
                    onChangeText={(text) => setFormData({ ...formData, aadhaar_number: text })}
                    error={errors.aadhaar_number}
                />
                <FormField
                    label="Email"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    value={formData.email || ''}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    error={errors.email}
                />
                <FormField
                    label="Mobile Number"
                    placeholder="Enter your mobile number"
                    keyboardType="phone-pad"
                    value={formData.mobile_number || ''}
                    onChangeText={(text) => setFormData({ ...formData, mobile_number: text })}
                    error={errors.mobile_number}
                />

                <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 2: Business Details</Text>
                <FormField
                    label="Business Name"
                    placeholder="Enter business name"
                    value={formData.business_name || ''}
                    onChangeText={(text) => setFormData({ ...formData, business_name: text })}
                    error={errors.business_name}
                />
                <FormField
                    label="Nature of Business"
                    placeholder="Enter nature of business"
                    value={formData.nature_of_business || ''}
                    onChangeText={(text) => setFormData({ ...formData, nature_of_business: text })}
                    error={errors.nature_of_business}
                />
                <FormField
                    label="Industry Type"
                    placeholder="Enter industry type"
                    value={formData.industry_type || ''}
                    onChangeText={(text) => setFormData({ ...formData, industry_type: text })}
                    error={errors.industry_type}
                />
                <FormField
                    label="Business PAN"
                    placeholder="Enter business PAN"
                    value={formData.business_pan || ''}
                    onChangeText={(text) => setFormData({ ...formData, business_pan: text })}
                    error={errors.business_pan}
                />
                <FormField
                    label="GSTIN"
                    placeholder="Enter GSTIN"
                    value={formData.gstin || ''}
                    onChangeText={(text) => setFormData({ ...formData, gstin: text })}
                    error={errors.gstin}
                />
                <FormField
                    label="Business Address"
                    placeholder="Enter business address"
                    multiline
                    value={formData.business_address || ''}
                    onChangeText={(text) => setFormData({ ...formData, business_address: text })}
                    error={errors.business_address}
                />
                <FormField
                    label="Udyam Registration Number"
                    placeholder="Enter Udyam registration number"
                    value={formData.udyam_registration || ''}
                    onChangeText={(text) => setFormData({ ...formData, udyam_registration: text })}
                    error={errors.udyam_registration}
                />
                <FormField
                    label="Website URL (if any)"
                    placeholder="Enter website URL"
                    value={formData.website_url || ''}
                    onChangeText={(text) => setFormData({ ...formData, website_url: text })}
                    error={errors.website_url}
                />
                <FormField
                    label="Business Type"
                    placeholder="Enter business type (e.g., Proprietorship, Partnership)"
                    value={formData.business_type || ''}
                    onChangeText={(text) => setFormData({ ...formData, business_type: text })}
                    error={errors.business_type}
                />
                <FormField
                    label="Year of Incorporation"
                    placeholder="YYYY-MM-DD"
                    value={formData.year_of_incorporation || ''}
                    onChangeText={(text) => setFormData({ ...formData, year_of_incorporation: text })}
                    error={errors.year_of_incorporation}
                />

                <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 3: Financial Information</Text>
                <FormField
                    label="Annual Turnover (Latest Year)"
                    placeholder="Enter annual turnover"
                    keyboardType="numeric"
                    value={formData.annual_turnover || ''}
                    onChangeText={(text) => setFormData({ ...formData, annual_turnover: text })}
                    error={errors.annual_turnover}
                />
                <FormField
                    label="Net Profit (Latest Year)"
                    placeholder="Enter net profit"
                    keyboardType="numeric"
                    value={formData.net_profit || ''}
                    onChangeText={(text) => setFormData({ ...formData, net_profit: text })}
                    error={errors.net_profit}
                />
                <FormField
                    label="Monthly Revenue (Average of last 6 months)"
                    placeholder="Enter average monthly revenue"
                    keyboardType="numeric"
                    value={formData.monthly_revenue || ''}
                    onChangeText={(text) => setFormData({ ...formData, monthly_revenue: text })}
                    error={errors.monthly_revenue}
                />
                <FormField
                    label="Current Liabilities"
                    placeholder="Enter current liabilities"
                    keyboardType="numeric"
                    value={formData.current_liabilities || ''}
                    onChangeText={(text) => setFormData({ ...formData, current_liabilities: text })}
                    error={errors.current_liabilities}
                />
                <FormField
                    label="Annual Turnover (Year 1)"
                    placeholder="Enter turnover for year 1"
                    keyboardType="numeric"
                    value={formData.annual_turnover_year1 || ''}
                    onChangeText={(text) => setFormData({ ...formData, annual_turnover_year1: text })}
                    error={errors.annual_turnover_year1}
                />
                <FormField
                    label="Annual Turnover (Year 2)"
                    placeholder="Enter turnover for year 2"
                    keyboardType="numeric"
                    value={formData.annual_turnover_year2 || ''}
                    onChangeText={(text) => setFormData({ ...formData, annual_turnover_year2: text })}
                    error={errors.annual_turnover_year2}
                />
                <FormField
                    label="Annual Turnover (Year 3)"
                    placeholder="Enter turnover for year 3"
                    keyboardType="numeric"
                    value={formData.annual_turnover_year3 || ''}
                    onChangeText={(text) => setFormData({ ...formData, annual_turnover_year3: text })}
                    error={errors.annual_turnover_year3}
                />
                <FormField
                    label="Net Profit (Year 1)"
                    placeholder="Enter net profit for year 1"
                    keyboardType="numeric"
                    value={formData.net_profit_year1 || ''}
                    onChangeText={(text) => setFormData({ ...formData, net_profit_year1: text })}
                    error={errors.net_profit_year1}
                />
                <FormField
                    label="Net Profit (Year 2)"
                    placeholder="Enter net profit for year 2"
                    keyboardType="numeric"
                    value={formData.net_profit_year2 || ''}
                    onChangeText={(text) => setFormData({ ...formData, net_profit_year2: text })}
                    error={errors.net_profit_year2}
                />
                <FormField
                    label="Net Profit (Year 3)"
                    placeholder="Enter net profit for year 3"
                    keyboardType="numeric"
                    value={formData.net_profit_year3 || ''}
                    onChangeText={(text) => setFormData({ ...formData, net_profit_year3: text })}
                    error={errors.net_profit_year3}
                />
                {/* monthly_revenue_6months is an array, handle accordingly if needed, for now a simple text field */}
                <FormField
                    label="Monthly Revenue (Last 6 Months - Comma Separated)"
                    placeholder="e.g., 10000,12000,11000,13000,10500,12500"
                    value={formData.monthly_revenue_6months || ''}
                    onChangeText={(text) => setFormData({ ...formData, monthly_revenue_6months: text })}
                    error={errors.monthly_revenue_6months}
                />

                <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 4: Loan Details</Text>
                <FormField
                    label="Loan Amount Required"
                    placeholder="Enter loan amount"
                    keyboardType="numeric"
                    value={formData.loan_amount || ''}
                    onChangeText={(text) => setFormData({ ...formData, loan_amount: text })}
                    error={errors.loan_amount}
                />
                <FormField
                    label="Loan Tenure (in months)"
                    placeholder="Enter loan tenure"
                    keyboardType="numeric"
                    value={formData.loan_tenure || ''}
                    onChangeText={(text) => setFormData({ ...formData, loan_tenure: text })}
                    error={errors.loan_tenure}
                />
                <FormField
                    label="Preferred EMI"
                    placeholder="Enter preferred EMI"
                    keyboardType="numeric"
                    value={formData.preferred_emi || ''}
                    onChangeText={(text) => setFormData({ ...formData, preferred_emi: text })}
                    error={errors.preferred_emi}
                />
                <FormField
                    label="Expected Disbursement Date"
                    placeholder="YYYY-MM-DD"
                    value={formData.disbursement_date || ''}
                    onChangeText={(text) => setFormData({ ...formData, disbursement_date: text })}
                    error={errors.disbursement_date}
                />
                <FormField
                    label="Purpose of Loan"
                    placeholder="Enter purpose of loan"
                    multiline
                    value={formData.loan_purpose || ''}
                    onChangeText={(text) => setFormData({ ...formData, loan_purpose: text })}
                    error={errors.loan_purpose}
                />

                <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 5: Document Uploads</Text>
                <ImageUploadCard
                    label="Bank Statements (Last 6 months - upload as single or multiple files)"
                    selectedImage={formData.bank_statements_url} // Assuming single file upload for simplicity, adjust if multiple
                    onImageSelect={(file) => setFormData({ ...formData, bank_statements_url: file })}
                    error={errors.bank_statements_url}
                />
                <ImageUploadCard
                    label="ITR Documents (Last 3 years - upload as single or multiple files)"
                    selectedImage={formData.itr_documents_url} // Assuming single file upload for simplicity
                    onImageSelect={(file) => setFormData({ ...formData, itr_documents_url: file })}
                    error={errors.itr_documents_url}
                />
                <ImageUploadCard
                    label="PAN Card (upload)"
                    selectedImage={formData.pan_card_url}
                    onImageSelect={(file) => setFormData({ ...formData, pan_card_url: file })}
                    error={errors.pan_card_url}
                />
                <ImageUploadCard
                    label="Aadhaar Card (upload)"
                    selectedImage={formData.aadhaar_card_url}
                    onImageSelect={(file) => setFormData({ ...formData, aadhaar_card_url: file })}
                    error={errors.aadhaar_card_url}
                />
                <ImageUploadCard
                    label="GST Certificate (upload)"
                    selectedImage={formData.gst_certificate_url}
                    onImageSelect={(file) => setFormData({ ...formData, gst_certificate_url: file })}
                    error={errors.gst_certificate_url}
                />
                <ImageUploadCard
                    label="Audited Financial Statements (if applicable - upload as single or multiple files)"
                    selectedImage={formData.audited_financial_statements_url} // Assuming single file upload
                    onImageSelect={(file) => setFormData({ ...formData, audited_financial_statements_url: file })}
                    error={errors.audited_financial_statements_url}
                />
                <ImageUploadCard
                    label="Udyam Registration Certificate (upload)"
                    selectedImage={formData.udyam_registration_url}
                    onImageSelect={(file) => setFormData({ ...formData, udyam_registration_url: file })}
                    error={errors.udyam_registration_url}
                />
                <ImageUploadCard
                    label="Business Address Proof (upload)"
                    selectedImage={formData.business_address_proof_url}
                    onImageSelect={(file) => setFormData({ ...formData, business_address_proof_url: file })}
                    error={errors.business_address_proof_url}
                />

                <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 6: Co-applicant Details (If Applicable)</Text>
                <FormField
                    label="Co-applicant Full Name"
                    placeholder="Enter co-applicant's full name"
                    value={formData.co_applicant_full_name || ''}
                    onChangeText={(text) => setFormData({ ...formData, co_applicant_full_name: text })}
                    error={errors.co_applicant_full_name}
                />
                <FormField
                    label="Relation to Applicant"
                    placeholder="Enter relation to applicant"
                    value={formData.co_applicant_relation || ''}
                    onChangeText={(text) => setFormData({ ...formData, co_applicant_relation: text })}
                    error={errors.co_applicant_relation}
                />
                <FormField
                    label="Co-applicant PAN Number"
                    placeholder="Enter co-applicant's PAN"
                    value={formData.co_applicant_pan || ''}
                    onChangeText={(text) => setFormData({ ...formData, co_applicant_pan: text })}
                    error={errors.co_applicant_pan}
                />
                <FormField
                    label="Co-applicant Aadhaar Number"
                    placeholder="Enter co-applicant's Aadhaar"
                    keyboardType="numeric"
                    value={formData.co_applicant_aadhaar || ''}
                    onChangeText={(text) => setFormData({ ...formData, co_applicant_aadhaar: text })}
                    error={errors.co_applicant_aadhaar}
                />
                <FormField
                    label="Co-applicant Contact Number"
                    placeholder="Enter co-applicant's contact number"
                    keyboardType="phone-pad"
                    value={formData.co_applicant_contact || ''}
                    onChangeText={(text) => setFormData({ ...formData, co_applicant_contact: text })}
                    error={errors.co_applicant_contact}
                />
                <FormField
                    label="Co-applicant Occupation"
                    placeholder="Enter co-applicant's occupation"
                    value={formData.co_applicant_occupation || ''}
                    onChangeText={(text) => setFormData({ ...formData, co_applicant_occupation: text })}
                    error={errors.co_applicant_occupation}
                />
                <FormField
                    label="Co-applicant Annual Income"
                    placeholder="Enter co-applicant's annual income"
                    keyboardType="numeric"
                    value={formData.co_applicant_annual_income || ''}
                    onChangeText={(text) => setFormData({ ...formData, co_applicant_annual_income: text })}
                    error={errors.co_applicant_annual_income}
                />
                <FormField
                    label="Co-applicant CIBIL Score"
                    placeholder="Enter co-applicant's CIBIL score"
                    keyboardType="numeric"
                    value={formData.co_applicant_cibil_score || ''}
                    onChangeText={(text) => setFormData({ ...formData, co_applicant_cibil_score: text })}
                    error={errors.co_applicant_cibil_score}
                />
                <ImageUploadCard
                    label="Co-applicant ID Proof (upload)"
                    selectedImage={formData.co_applicant_id_proof_url}
                    onImageSelect={(file) => setFormData({ ...formData, co_applicant_id_proof_url: file })}
                    error={errors.co_applicant_id_proof_url}
                />
                <ImageUploadCard
                    label="Co-applicant Income Proof (upload)"
                    selectedImage={formData.co_applicant_income_proof_url}
                    onImageSelect={(file) => setFormData({ ...formData, co_applicant_income_proof_url: file })}
                    error={errors.co_applicant_income_proof_url}
                />

                <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 7: Collateral Details (If Applicable)</Text>
                <FormField
                    label="Do you have collateral to offer? (Yes/No)"
                    placeholder="Yes or No"
                    value={formData.has_collateral ? 'Yes' : 'No'} // Assuming boolean to string conversion
                    onChangeText={(text) => setFormData({ ...formData, has_collateral: text.toLowerCase() === 'yes' })}
                    error={errors.has_collateral}
                />
                <FormField
                    label="Collateral Asset Type"
                    placeholder="e.g., Property, Gold, Vehicle"
                    value={formData.collateral_asset_type || ''}
                    onChangeText={(text) => setFormData({ ...formData, collateral_asset_type: text })}
                    error={errors.collateral_asset_type}
                />
                <FormField
                    label="Collateral Asset Value"
                    placeholder="Enter asset value"
                    keyboardType="numeric"
                    value={formData.collateral_asset_value || ''}
                    onChangeText={(text) => setFormData({ ...formData, collateral_asset_value: text })}
                    error={errors.collateral_asset_value}
                />
                <ImageUploadCard
                    label="Collateral Ownership Proof (upload)"
                    selectedImage={formData.collateral_ownership_proof_url}
                    onImageSelect={(file) => setFormData({ ...formData, collateral_ownership_proof_url: file })}
                    error={errors.collateral_ownership_proof_url}
                />
                <FormField
                    label="Collateral Asset Location"
                    placeholder="Enter asset location"
                    value={formData.collateral_asset_location || ''}
                    onChangeText={(text) => setFormData({ ...formData, collateral_asset_location: text })}
                    error={errors.collateral_asset_location}
                />
                <ImageUploadCard
                    label="Other Collateral Documents (upload as single or multiple files)"
                    selectedImage={formData.collateral_documents_url} // Assuming single file upload
                    onImageSelect={(file) => setFormData({ ...formData, collateral_documents_url: file })}
                    error={errors.collateral_documents_url}
                />

                <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 8: Bank Account Details for Disbursement</Text>
                <FormField
                    label="Bank Account Holder Name"
                    placeholder="Enter account holder name"
                    value={formData.bank_account_holder_name || ''}
                    onChangeText={(text) => setFormData({ ...formData, bank_account_holder_name: text })}
                    error={errors.bank_account_holder_name}
                />
                <FormField
                    label="Bank Name"
                    placeholder="Enter bank name"
                    value={formData.bank_name || ''}
                    onChangeText={(text) => setFormData({ ...formData, bank_name: text })}
                    error={errors.bank_name}
                />
                <FormField
                    label="Account Number"
                    placeholder="Enter account number"
                    keyboardType="numeric"
                    value={formData.account_number || ''}
                    onChangeText={(text) => setFormData({ ...formData, account_number: text })}
                    error={errors.account_number}
                />
                <FormField
                    label="IFSC Code"
                    placeholder="Enter IFSC code"
                    value={formData.ifsc_code || ''}
                    onChangeText={(text) => setFormData({ ...formData, ifsc_code: text })}
                    error={errors.ifsc_code}
                />
                <FormField
                    label="Bank Branch"
                    placeholder="Enter bank branch"
                    value={formData.bank_branch || ''}
                    onChangeText={(text) => setFormData({ ...formData, bank_branch: text })}
                    error={errors.bank_branch}
                />

                <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 9: Declaration and Signature</Text>
                <FormField
                    label="I hereby declare that the information provided is true and correct to the best of my knowledge. (Type 'Yes' to accept)"
                    placeholder="Type 'Yes'"
                    value={formData.declaration_accepted ? 'Yes' : ''} // Assuming boolean to string conversion
                    onChangeText={(text) => setFormData({ ...formData, declaration_accepted: text.toLowerCase() === 'yes' })}
                    error={errors.declaration_accepted}
                />
                {/* e_signature might be a more complex component or handled differently, for now a text field or image upload */}
                <ImageUploadCard
                    label="E-Signature (Upload image of signature)"
                    selectedImage={formData.e_signature}
                    onImageSelect={(file) => setFormData({ ...formData, e_signature: file })}
                    error={errors.e_signature}
                />
            </View>
        </View>
    );
};

export default BusinessLoanForm;
