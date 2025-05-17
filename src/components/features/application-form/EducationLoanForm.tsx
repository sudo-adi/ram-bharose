import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; // Added Text import
import ImageUploadCard from './ImageUploadCard'; // Added ImageUploadCard import
import FormField from './FormField';

interface EducationLoanFormProps {
    formData: any;
    setFormData: (data: any) => void;
    errors: any;
    setErrors: (errors: any) => void;
}

const EducationLoanForm: React.FC<EducationLoanFormProps> = ({ formData, setFormData, errors, setErrors }) => {
    // Add this function at the start of your component
    const fillTestData = () => {
        const testData = {
            full_name: "Test User",
            date_of_birth: "1995-01-01",
            gender: "Male",
            marital_status: "Single",
            nationality: "Indian",
            mobile_number: "9876543210",
            email_id: "test@example.com",
            permanent_address: "123 Test Street, Test City",
            current_address: "123 Test Street, Test City",
            aadhaar_number: "123456789012",
            pan_number: "ABCDE1234F",
            passport_number: "A1234567",
            cibil_score: "750",
            course_name: "Computer Science",
            level_of_study: "UG",
            mode_of_study: "Full-time",
            course_duration: "4 years",
            institution_name: "Test University",
            institution_type: "India",
            institution_address: "Test University Campus, Test City",
            commencement_date: "2024-08-01",
            completion_date: "2028-07-31",
            visa_status: "NA",
            total_course_fee: "400000",
            other_expenses: "100000",
            loan_amount: "500000",
            self_contribution: "100000",
            repayment_period: "7",
            moratorium_period: "1", // Schema type is integer, test data is string. Assuming FormField handles conversion or backend does.
            tenth_details: "CBSE / 2010 / 95%",
            twelfth_details: "CBSE / 2012 / 90%",
            graduation_details: "NA",
            competitive_exams: "JEE", // Schema type is jsonb. Assuming FormField handles as string.
            employment_status: false,
            company_name: "", // Assuming empty if not employed
            designation: "", // Assuming empty if not employed
            annual_income: "987654", // Assuming empty if not employed
            work_experience: "1", // Assuming empty if not employed
            co_applicant_name: "Test Parent",
            co_applicant_relation: "Father",
            co_applicant_dob: "1970-01-01",
            co_applicant_mobile: "9876543211",
            co_applicant_email: "parent@example.com",
            co_applicant_occupation: "Business",
            co_applicant_employer: "Self Employed",
            co_applicant_income: "1000000",
            co_applicant_pan: "FGHIJ4321K",
            co_applicant_aadhaar: "987654321012",
            co_applicant_cibil_score: "780",
            bank_account_holder_name: "Test User",
            bank_name: "Test Bank",
            bank_branch: "Test Branch",
            bank_account_number: "1234567890",
            bank_ifsc_code: "TEST0001234",
            declaration_date: "2024-01-01",
            declaration_signed: true,
            security_offered: "Some security offered details", // Added for completeness
            // Fields for ImageUploadCards are typically not in testData unless they are URLs
            // admission_letter_url: null, 
            // academic_certificates_url: null,
            // salary_slips_url: null,
            // co_applicant_address_proof_url: null,
            // co_applicant_income_proof_url: null,
            // applicant_signature: null,
            // co_applicant_signature: null,
        };
        setFormData({ ...formData, ...testData });
    };

    // Add this button at the start of your return statement, right after the opening View tag
    return (
        <View>
            {/* <TouchableOpacity
                onPress={fillTestData}
                className="bg-gray-200 py-2 px-4 rounded-lg mb-4"
            >
                <Text className="text-gray-700 text-center">Fill Test Data</Text>
            </TouchableOpacity> */}

            <Text className="text-lg font-semibold text-gray-700 mb-3">Section 1: Applicant Personal Details</Text>
            <FormField
                label="Full Name (as per Aadhaar/PAN)"
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
                label="Marital Status"
                placeholder="Select Marital Status"
                value={formData.marital_status || ''}
                onChangeText={(text) => setFormData({ ...formData, marital_status: text })}
                error={errors.marital_status}
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
                value={formData.mobile_number || ''}
                onChangeText={(text) => setFormData({ ...formData, mobile_number: text })}
                error={errors.mobile_number}
            />
            <FormField
                label="Email ID"
                placeholder="Enter your email ID"
                keyboardType="email-address"
                value={formData.email_id || ''}
                onChangeText={(text) => setFormData({ ...formData, email_id: text })}
                error={errors.email_id}
            />
            <FormField
                label="Permanent Address"
                placeholder="Enter your permanent address"
                multiline
                value={formData.permanent_address || ''}
                onChangeText={(text) => setFormData({ ...formData, permanent_address: text })}
                error={errors.permanent_address}
            />
            <FormField
                label="Current Address"
                placeholder="Enter your current address"
                multiline
                value={formData.current_address || ''}
                onChangeText={(text) => setFormData({ ...formData, current_address: text })}
                error={errors.current_address}
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
                label="PAN Number"
                placeholder="Enter your PAN number"
                value={formData.pan_number || ''}
                onChangeText={(text) => setFormData({ ...formData, pan_number: text })}
                error={errors.pan_number}
            />
            <FormField
                label="Passport Number (if available)"
                placeholder="Enter your passport number"
                value={formData.passport_number || ''}
                onChangeText={(text) => setFormData({ ...formData, passport_number: text })}
                error={errors.passport_number}
            />
            <FormField
                label="CIBIL Score (if known)"
                placeholder="Enter your CIBIL score"
                keyboardType="numeric"
                value={formData.cibil_score || ''}
                onChangeText={(text) => setFormData({ ...formData, cibil_score: text })}
                error={errors.cibil_score}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 2: Course & Institution Details</Text>
            <FormField
                label="Course Name"
                placeholder="Enter course name"
                value={formData.course_name || ''}
                onChangeText={(text) => setFormData({ ...formData, course_name: text })}
                error={errors.course_name}
            />
            <FormField
                label="Level of Study (UG/PG/Diploma/PhD)"
                placeholder="Select level of study"
                value={formData.level_of_study || ''}
                onChangeText={(text) => setFormData({ ...formData, level_of_study: text })}
                error={errors.level_of_study}
            />
            <FormField
                label="Mode of Study (Full-time/Part-time/Distance)"
                placeholder="Select mode of study"
                value={formData.mode_of_study || ''}
                onChangeText={(text) => setFormData({ ...formData, mode_of_study: text })}
                error={errors.mode_of_study}
            />
            <FormField
                label="Course Duration"
                placeholder="Enter course duration"
                value={formData.course_duration || ''}
                onChangeText={(text) => setFormData({ ...formData, course_duration: text })}
                error={errors.course_duration}
            />
            <FormField
                label="Institution Name"
                placeholder="Enter institution name"
                value={formData.institution_name || ''}
                onChangeText={(text) => setFormData({ ...formData, institution_name: text })}
                error={errors.institution_name}
            />
            <FormField
                label="Institution Type (India/Abroad)"
                placeholder="Select institution type"
                value={formData.institution_type || ''}
                onChangeText={(text) => setFormData({ ...formData, institution_type: text })}
                error={errors.institution_type}
            />
            <FormField
                label="Institution Address"
                placeholder="Enter institution address"
                multiline
                value={formData.institution_address || ''}
                onChangeText={(text) => setFormData({ ...formData, institution_address: text })}
                error={errors.institution_address}
            />
            <ImageUploadCard
                label="Admission Letter (upload)"
                selectedImage={formData.admission_letter_url}
                onImageSelect={(file) => setFormData({ ...formData, admission_letter_url: file })}
                error={errors.admission_letter_url}
            />
            <FormField
                label="Commencement Date"
                placeholder="YYYY-MM-DD"
                value={formData.commencement_date || ''}
                onChangeText={(text) => setFormData({ ...formData, commencement_date: text })}
                error={errors.commencement_date}
            />
            <FormField
                label="Expected Completion Date"
                placeholder="YYYY-MM-DD"
                value={formData.completion_date || ''}
                onChangeText={(text) => setFormData({ ...formData, completion_date: text })}
                error={errors.completion_date}
            />
            <FormField
                label="Visa Status (for overseas)"
                placeholder="Enter visa status"
                value={formData.visa_status || ''}
                onChangeText={(text) => setFormData({ ...formData, visa_status: text })}
                error={errors.visa_status}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 3: Loan Requirement</Text>
            <FormField
                label="Total Course Fee"
                placeholder="Enter total course fee"
                keyboardType="numeric"
                value={formData.total_course_fee || ''}
                onChangeText={(text) => setFormData({ ...formData, total_course_fee: text })}
                error={errors.total_course_fee}
            />
            <FormField
                label="Other Expenses (Accommodation, Travel, Books, etc.)"
                placeholder="Enter other expenses"
                keyboardType="numeric"
                value={formData.other_expenses || ''}
                onChangeText={(text) => setFormData({ ...formData, other_expenses: text })}
                error={errors.other_expenses}
            />
            <FormField
                label="Total Loan Amount Required"
                placeholder="Enter total loan amount required"
                keyboardType="numeric"
                value={formData.loan_amount || ''}
                onChangeText={(text) => setFormData({ ...formData, loan_amount: text })}
                error={errors.loan_amount}
            />
            <FormField
                label="Contribution from Family/Self"
                placeholder="Enter contribution amount"
                keyboardType="numeric"
                value={formData.self_contribution || ''}
                onChangeText={(text) => setFormData({ ...formData, self_contribution: text })}
                error={errors.self_contribution}
            />
            <FormField
                label="Repayment Period (in years)"
                placeholder="Enter repayment period"
                keyboardType="numeric"
                value={formData.repayment_period || ''}
                onChangeText={(text) => setFormData({ ...formData, repayment_period: text })}
                error={errors.repayment_period}
            />
            <FormField
                label="Moratorium Period (if required)"
                placeholder="Enter moratorium period"
                value={formData.moratorium_period || ''}
                onChangeText={(text) => setFormData({ ...formData, moratorium_period: text })}
                error={errors.moratorium_period}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 4: Academic Background</Text>
            <FormField
                label="10th Board Name / Year / Marks"
                placeholder="Enter 10th details"
                value={formData.tenth_details || ''}
                onChangeText={(text) => setFormData({ ...formData, tenth_details: text })}
                error={errors.tenth_details}
            />
            <FormField
                label="12th Board Name / Year / Marks"
                placeholder="Enter 12th details"
                value={formData.twelfth_details || ''}
                onChangeText={(text) => setFormData({ ...formData, twelfth_details: text })}
                error={errors.twelfth_details}
            />
            <FormField
                label="Graduation Details (if applicable)"
                placeholder="Enter graduation details"
                value={formData.graduation_details || ''}
                onChangeText={(text) => setFormData({ ...formData, graduation_details: text })}
                error={errors.graduation_details}
            />
            <FormField
                label="Competitive Exams Cleared (e.g., GRE/GMAT/IELTS)"
                placeholder="Enter exams cleared"
                value={formData.competitive_exams || ''}
                onChangeText={(text) => setFormData({ ...formData, competitive_exams: text })}
                error={errors.competitive_exams}
            />
            <ImageUploadCard
                label="Academic Certificates (upload)"
                selectedImage={formData.academic_certificates_url}
                onImageSelect={(file) => setFormData({ ...formData, academic_certificates_url: file })}
                error={errors.academic_certificates_url}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 5: Employment Details (If Applicable)</Text>
            <FormField
                label="Currently Employed? (Yes/No)"
                placeholder="Select Yes or No"
                value={formData.employment_status === true ? 'Yes' : formData.employment_status === false ? 'No' : ''}
                onChangeText={(text) => setFormData({ ...formData, employment_status: text.toLowerCase() === 'yes' ? true : text.toLowerCase() === 'no' ? false : undefined })}
                error={errors.employment_status}
            />
            <FormField
                label="Company Name"
                placeholder="Enter company name"
                value={formData.company_name || ''}
                onChangeText={(text) => setFormData({ ...formData, company_name: text })}
                error={errors.company_name}
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
                value={formData.annual_income || ''}
                onChangeText={(text) => setFormData({ ...formData, annual_income: text })}
                error={errors.annual_income}
            />
            <FormField
                label="Work Experience (in years)"
                placeholder="Enter work experience"
                keyboardType="numeric"
                value={formData.work_experience || ''}
                onChangeText={(text) => setFormData({ ...formData, work_experience: text })}
                error={errors.work_experience}
            />
            <ImageUploadCard
                label="Salary Slips / ITR / Form 16 (upload)"
                selectedImage={formData.salary_slips_url}
                onImageSelect={(file) => setFormData({ ...formData, salary_slips_url: file })}
                error={errors.salary_slips_url}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 6: Co-applicant/Guarantor Details (Mandatory)</Text>
            <FormField
                label="Full Name"
                placeholder="Enter co-applicant's full name"
                value={formData.co_applicant_name || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_name: text })}
                error={errors.co_applicant_name}
            />
            <FormField
                label="Relation to Applicant"
                placeholder="Enter relation to applicant"
                value={formData.co_applicant_relation || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_relation: text })}
                error={errors.co_applicant_relation}
            />
            <FormField
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={formData.co_applicant_dob || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_dob: text })}
                error={errors.co_applicant_dob}
            />
            <FormField
                label="Mobile Number"
                placeholder="Enter co-applicant's mobile number"
                keyboardType="phone-pad"
                value={formData.co_applicant_mobile || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_mobile: text })}
                error={errors.co_applicant_mobile}
            />
            <FormField
                label="Email ID"
                placeholder="Enter co-applicant's email ID"
                keyboardType="email-address"
                value={formData.co_applicant_email || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_email: text })}
                error={errors.co_applicant_email}
            />
            <FormField
                label="Occupation"
                placeholder="Enter co-applicant's occupation"
                value={formData.co_applicant_occupation || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_occupation: text })}
                error={errors.co_applicant_occupation}
            />
            <FormField
                label="Employer Name"
                placeholder="Enter co-applicant's employer name"
                value={formData.co_applicant_employer || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_employer: text })}
                error={errors.co_applicant_employer}
            />
            <FormField
                label="Annual Income"
                placeholder="Enter co-applicant's annual income"
                keyboardType="numeric"
                value={formData.co_applicant_income || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_income: text })}
                error={errors.co_applicant_income}
            />
            <FormField
                label="PAN Number"
                placeholder="Enter co-applicant's PAN number"
                value={formData.co_applicant_pan || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_pan: text })}
                error={errors.co_applicant_pan}
            />
            <FormField
                label="Aadhaar Number"
                placeholder="Enter co-applicant's Aadhaar number"
                keyboardType="numeric"
                value={formData.co_applicant_aadhaar || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_aadhaar: text })}
                error={errors.co_applicant_aadhaar}
            />
            <ImageUploadCard
                label="Address Proof (upload)"
                selectedImage={formData.co_applicant_address_proof_url}
                onImageSelect={(file) => setFormData({ ...formData, co_applicant_address_proof_url: file })}
                error={errors.co_applicant_address_proof_url}
            />
            <ImageUploadCard
                label="Income Proof (ITR/Form16/Salary Slips)"
                selectedImage={formData.co_applicant_income_proof_url}
                onImageSelect={(file) => setFormData({ ...formData, co_applicant_income_proof_url: file })}
                error={errors.co_applicant_income_proof_url}
            />
            <FormField
                label="CIBIL Score (if known)"
                placeholder="Enter co-applicant's CIBIL score"
                keyboardType="numeric"
                value={formData.co_applicant_cibil_score || ''}
                onChangeText={(text) => setFormData({ ...formData, co_applicant_cibil_score: text })}
                error={errors.co_applicant_cibil_score}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 7: Asset & Liability Details</Text>
            <FormField
                label="Movable Assets (FDs, Shares, Vehicles, etc.)"
                placeholder="Enter details of movable assets"
                multiline
                value={formData.movable_assets || ''} // Renamed from movableAssets
                onChangeText={(text) => setFormData({ ...formData, movable_assets: text })}
                error={errors.movable_assets}
            />
            <FormField
                label="Immovable Assets (Property, Land, etc.)"
                placeholder="Enter details of immovable assets"
                multiline
                value={formData.immovable_assets || ''} // Renamed from immovableAssets
                onChangeText={(text) => setFormData({ ...formData, immovable_assets: text })}
                error={errors.immovable_assets}
            />
            <FormField
                label="Existing Loans (Home, Car, Personal, etc.)"
                placeholder="Enter details of existing loans"
                multiline
                value={formData.existing_loans || ''} // Renamed from existingLoans
                onChangeText={(text) => setFormData({ ...formData, existing_loans: text })}
                error={errors.existing_loans}
            />
            <FormField
                label="Total Liabilities (Outstanding Loan Amounts)"
                placeholder="Enter total liabilities"
                keyboardType="numeric"
                value={formData.total_liabilities || ''} // Renamed from totalLiabilities
                onChangeText={(text) => setFormData({ ...formData, total_liabilities: text })}
                error={errors.total_liabilities}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 8: Security & Bank Details</Text>
            <FormField
                label="Details of Security Offered (Property/FD/Shares etc.)"
                placeholder="Enter details of security offered"
                multiline
                value={formData.security_offered || ''} // Renamed from securityOfferedDetails
                onChangeText={(text) => setFormData({ ...formData, security_offered: text })}
                error={errors.security_offered}
            />
            {/* Removed ImageUploadCard for security_document as it's not in schema, security_offered is text */}

            <Text className="text-md font-semibold text-gray-600 mt-4 mb-2">Bank Account Details for Loan Disbursement</Text>
            <FormField
                label="Account Holder Name"
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
                label="Branch"
                placeholder="Enter branch name"
                value={formData.bank_branch || ''} // Renamed from branch
                onChangeText={(text) => setFormData({ ...formData, bank_branch: text })}
                error={errors.bank_branch}
            />
            <FormField
                label="Account Number"
                placeholder="Enter account number"
                keyboardType="numeric"
                value={formData.bank_account_number || ''}
                onChangeText={(text) => setFormData({ ...formData, bank_account_number: text })}
                error={errors.bank_account_number}
            />
            <FormField
                label="IFSC Code"
                placeholder="Enter IFSC code"
                value={formData.bank_ifsc_code || ''} // Renamed from ifscCode
                onChangeText={(text) => setFormData({ ...formData, bank_ifsc_code: text })}
                error={errors.bank_ifsc_code}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 9: Documents to be Uploaded</Text>
            {/* Removed ImageUploadCards for id_proof_applicant, address_proof_applicant, bank_statement as they are not in schema */}
            <Text className="text-sm text-gray-600 mb-2">Please upload clear copies of the following documents:</Text>
            <Text className="text-xs text-gray-500 mb-1">- Admission Letter (already covered in Section 2)</Text>
            <Text className="text-xs text-gray-500 mb-1">- Academic Certificates (already covered in Section 4)</Text>
            <Text className="text-xs text-gray-500 mb-1">- Salary Slips / ITR / Form 16 (if employed, covered in Section 5)</Text>
            <Text className="text-xs text-gray-500 mb-1">- Co-applicant Address & Income Proof (covered in Section 6)</Text>

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 10: Declaration & Signature</Text>
            <Text className="text-sm text-gray-600 mb-3">
                I/We hereby declare that the information provided above is true and correct to the best of my/our knowledge and belief. I/We understand that the loan is subject to the terms and conditions of the bank/financial institution.
            </Text>
            <FormField
                label="Date"
                placeholder="YYYY-MM-DD"
                value={formData.declaration_date || ''} // Renamed from declarationDate
                onChangeText={(text) => setFormData({ ...formData, declaration_date: text })}
                error={errors.declaration_date}
            />
            {/* declaration_signed is a boolean, typically handled by a CheckBox or similar, not a FormField for text. For now, not adding a visible form element for it, assuming it's set programmatically or via a dedicated component. */}
            <ImageUploadCard
                label="Applicant Signature (upload)"
                selectedImage={formData.applicant_signature_url}
                onImageSelect={(file) => setFormData({ ...formData, applicant_signature_url: file })}
                error={errors.applicant_signature_url}
            />
            <ImageUploadCard
                label="Co-applicant Signature (upload)"
                selectedImage={formData.co_applicant_signature_url}
                onImageSelect={(file) => setFormData({ ...formData, co_applicant_signature_url: file })}
                error={errors.co_applicant_signature_url}
            />
        </View>
    );
};

export default EducationLoanForm;