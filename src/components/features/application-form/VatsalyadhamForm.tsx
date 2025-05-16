import React from 'react';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import ImageUploadCard from './ImageUploadCard';
import FormField from './FormField';

interface VatsalyadhamFormProps {
    formData: any;
    setFormData: (data: any) => void;
    errors: any;
    setErrors: (errors: any) => void;
}



const VatsalyadhamForm: React.FC<VatsalyadhamFormProps> = ({ formData, setFormData, errors, setErrors }) => {
    const fillTestData = () => {
        const testData = {
            // Step 1: Personal Details
            full_name: "Test Elderly User",
            date_of_birth: "1950-01-01",
            gender: "Male",
            marital_status: "Widowed",
            blood_group: "O+",
            mobile_number: "9876543210",
            email_address: "testelderly@example.com",
            aadhaar_number: "123456789012",
            pan: "ABCDE1234F",
            religion_caste: "Hindu/General",

            // Step 2: Current Residential Details
            full_address: "123 Elder Care Lane, Sector 7",
            city: "Ahmedabad",
            state: "Gujarat",
            pincode: "380001",
            is_permanent_address: "true",
            alternate_contact_address: "Care of Dr. Patel, 456 Medical Center Road, Ahmedabad",

            // Step 3: Guardian / Family Details
            guardian_full_name: "Rajesh Kumar",
            relation_to_applicant: "Son",
            guardian_contact_number: "9876543211",
            guardian_alternate_number: "9876543212",
            guardian_email: "rajesh@example.com",
            guardian_address: "789 Family Home, Satellite, Ahmedabad, Gujarat - 380015",

            // Step 4: Health & Medical Details
            known_medical_conditions: "Diabetes Type 2, Hypertension, Mild Arthritis",
            on_regular_medication: "true",
            list_of_medications: "Metformin 500mg twice daily, Amlodipine 5mg once daily, Acetaminophen as needed for pain",
            allergies: "Penicillin, Dust",
            disability_or_mobility_assistance: "false",
            covid_vaccination_status: "Fully",

            // Step 5: Lifestyle & Support
            languages_spoken: "Gujarati, Hindi, English",
            dietary_preferences: "Vegetarian, No onion/garlic, Low sugar diet",
            requires_spiritual_support: "true",
            self_care_ability: "Partially",
            past_psychiatric_treatment: "None",

            // Step 6: Legal & Consent
            under_legal_guardianship: "false",

            // Step 7: Final Declaration & Submit
            declaration_accepted: "true"
        };

        setFormData({ ...formData, ...testData });
    };
    return (
        <View>
            <TouchableOpacity
                onPress={fillTestData}
                className="bg-gray-200 py-2 px-4 rounded-lg mb-4"
            >
                <Text className="text-gray-700 text-center">Fill Test Data</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-700 mb-3">Step 1: Personal Details of the Elderly Applicant</Text>
            <FormField
                label="Full Name (as per Aadhaar)"
                placeholder="Enter applicant's full name"
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
                label="Blood Group"
                placeholder="Enter blood group"
                value={formData.blood_group || ''}
                onChangeText={(text) => setFormData({ ...formData, blood_group: text })}
                error={errors.blood_group}
            />
            <FormField
                label="Mobile Number (if applicable)"
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                value={formData.mobile_number || ''}
                onChangeText={(text) => setFormData({ ...formData, mobile_number: text })}
                error={errors.mobile_number}
            />
            <FormField
                label="Email Address (optional)"
                placeholder="Enter email address"
                keyboardType="email-address"
                value={formData.email_address || ''}
                onChangeText={(text) => setFormData({ ...formData, email_address: text })}
                error={errors.email_address}
            />
            <FormField
                label="Aadhaar Number"
                placeholder="Enter Aadhaar number"
                keyboardType="numeric"
                value={formData.aadhaar_number || ''}
                onChangeText={(text) => setFormData({ ...formData, aadhaar_number: text })}
                error={errors.aadhaar_number}
            />
            <FormField
                label="PAN"
                placeholder="Enter PAN number"
                value={formData.pan || ''}
                onChangeText={(text) => setFormData({ ...formData, pan: text })}
                error={errors.pan}
            />
            <FormField
                label="Religion/Caste"
                placeholder="Enter religion and caste"
                value={formData.religion_caste || ''}
                onChangeText={(text) => setFormData({ ...formData, religion_caste: text })}
                error={errors.religion_caste}
            />
            <ImageUploadCard
                label="Recent Photo (upload)"
                selectedImage={formData.recent_photo}
                onImageSelect={(file) => setFormData({ ...formData, recent_photo: file })}
                error={errors.recent_photo}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 2: Current Residential Details</Text>
            <FormField
                label="Full Address"
                placeholder="Enter full address"
                multiline
                value={formData.full_address || ''}
                onChangeText={(text) => setFormData({ ...formData, full_address: text })}
                error={errors.full_address}
            />
            <FormField
                label="City"
                placeholder="Enter city"
                value={formData.city || ''}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                error={errors.city}
            />
            <FormField
                label="State"
                placeholder="Enter state"
                value={formData.state || ''}
                onChangeText={(text) => setFormData({ ...formData, state: text })}
                error={errors.state}
            />
            <FormField
                label="Pincode"
                placeholder="Enter pincode"
                keyboardType="numeric"
                value={formData.pincode || ''}
                onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                error={errors.pincode}
            />
            <FormField
                label="Is this also your Permanent Address?"
                placeholder="Select Yes/No"
                value={formData.is_permanent_address || 'false'}
                onChangeText={(text) => setFormData({ ...formData, is_permanent_address: text })}
                error={errors.is_permanent_address}
            />
            <FormField
                label="Alternate Contact Address (if different)"
                placeholder="Enter alternate address"
                multiline
                value={formData.alternate_contact_address || ''}
                onChangeText={(text) => setFormData({ ...formData, alternate_contact_address: text })}
                error={errors.alternate_contact_address}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 3: Guardian / Family Details</Text>
            <FormField
                label="Guardian's Full Name"
                placeholder="Enter guardian's full name"
                value={formData.guardian_full_name || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_full_name: text })}
                error={errors.guardian_full_name}
            />
            <FormField
                label="Relationship with Applicant"
                placeholder="e.g., Son, Daughter, Spouse"
                value={formData.relation_to_applicant || ''}
                onChangeText={(text) => setFormData({ ...formData, relation_to_applicant: text })}
                error={errors.relation_to_applicant}
            />
            <FormField
                label="Guardian's Contact Number"
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                value={formData.guardian_contact_number || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_contact_number: text })}
                error={errors.guardian_contact_number}
            />
            <FormField
                label="Guardian's Alternate Number"
                placeholder="Enter alternate contact number"
                keyboardType="phone-pad"
                value={formData.guardian_alternate_number || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_alternate_number: text })}
                error={errors.guardian_alternate_number}
            />
            <FormField
                label="Guardian's Email Address"
                placeholder="Enter email address"
                keyboardType="email-address"
                value={formData.guardian_email || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_email: text })}
                error={errors.guardian_email}
            />
            <FormField
                label="Guardian's Full Address"
                placeholder="Enter guardian's full address"
                multiline
                value={formData.guardian_address || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_address: text })}
                error={errors.guardian_address}
            />
            <ImageUploadCard
                label="Guardian's ID Proof (Aadhaar/PAN - upload)"
                selectedImage={formData.guardian_id_proof}
                onImageSelect={(file) => setFormData({ ...formData, guardian_id_proof: file })}
                error={errors.guardian_id_proof}
            />
            <ImageUploadCard
                label="Consent Letter from Guardian/Family"
                selectedImage={formData.consent_letter}
                onImageSelect={(file) => setFormData({ ...formData, consent_letter: file })}
                error={errors.consent_letter}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 4: Health & Medical Details</Text>
            <FormField
                label="Known Medical Conditions"
                placeholder="e.g., Diabetes, Hypertension, Arthritis"
                multiline
                value={formData.known_medical_conditions || ''}
                onChangeText={(text) => setFormData({ ...formData, known_medical_conditions: text })}
                error={errors.known_medical_conditions}
            />
            <FormField
                label="Are you on regular medication?"
                placeholder="Select Yes/No"
                value={formData.on_regular_medication || 'false'}
                onChangeText={(text) => setFormData({ ...formData, on_regular_medication: text })}
                error={errors.on_regular_medication}
            />
            <FormField
                label="List of Medications (with dosage)"
                placeholder="List medications and dosages"
                multiline
                value={formData.list_of_medications || ''}
                onChangeText={(text) => setFormData({ ...formData, list_of_medications: text })}
                error={errors.list_of_medications}
            />
            <FormField
                label="Any Known Allergies"
                placeholder="e.g., Food, Medicine, Dust"
                value={formData.allergies || ''}
                onChangeText={(text) => setFormData({ ...formData, allergies: text })}
                error={errors.allergies}
            />
            <FormField
                label="Do you require disability or mobility assistance?"
                placeholder="Select Yes/No"
                value={formData.disability_or_mobility_assistance || 'false'}
                onChangeText={(text) => setFormData({ ...formData, disability_or_mobility_assistance: text })}
                error={errors.disability_or_mobility_assistance}
            />
            <ImageUploadCard
                label="Recent Medical Certificate (upload)"
                selectedImage={formData.recent_medical_certificate}
                onImageSelect={(file) => setFormData({ ...formData, recent_medical_certificate: file })}
                error={errors.recent_medical_certificate}
            />
            <FormField
                label="COVID-19 Vaccination Status"
                placeholder="Select status (Fully/Partially/Not Vaccinated)"
                value={formData.covid_vaccination_status || ''}
                onChangeText={(text) => setFormData({ ...formData, covid_vaccination_status: text })}
                error={errors.covid_vaccination_status}
            />
            <ImageUploadCard
                label="Vaccination Certificate (upload)"
                selectedImage={formData.vaccination_certificate}
                onImageSelect={(file) => setFormData({ ...formData, vaccination_certificate: file })}
                error={errors.vaccination_certificate}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 5: Lifestyle & Support</Text>
            <FormField
                label="Languages Spoken"
                placeholder="List languages spoken"
                value={formData.languages_spoken || ''}
                onChangeText={(text) => setFormData({ ...formData, languages_spoken: text })}
                error={errors.languages_spoken}
            />
            <FormField
                label="Dietary Preferences"
                placeholder="Enter dietary preferences"
                value={formData.dietary_preferences || ''}
                onChangeText={(text) => setFormData({ ...formData, dietary_preferences: text })}
                error={errors.dietary_preferences}
            />
            <FormField
                label="Do you require spiritual support?"
                placeholder="Select Yes/No"
                value={formData.requires_spiritual_support || 'false'}
                onChangeText={(text) => setFormData({ ...formData, requires_spiritual_support: text })}
                error={errors.requires_spiritual_support}
            />
            <FormField
                label="Self-Care Ability"
                placeholder="Select (Yes/Partially/No)"
                value={formData.self_care_ability || ''}
                onChangeText={(text) => setFormData({ ...formData, self_care_ability: text })}
                error={errors.self_care_ability}
            />
            <FormField
                label="Past Psychiatric Treatment (if any)"
                placeholder="Enter details if applicable"
                multiline
                value={formData.past_psychiatric_treatment || ''}
                onChangeText={(text) => setFormData({ ...formData, past_psychiatric_treatment: text })}
                error={errors.past_psychiatric_treatment}
            />
            <ImageUploadCard
                label="Disability Certificate (if applicable)"
                selectedImage={formData.disability_certificate}
                onImageSelect={(file) => setFormData({ ...formData, disability_certificate: file })}
                error={errors.disability_certificate}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 6: Legal & Consent</Text>
            <FormField
                label="Are you under legal guardianship?"
                placeholder="Select Yes/No"
                value={formData.under_legal_guardianship || 'false'}
                onChangeText={(text) => setFormData({ ...formData, under_legal_guardianship: text })}
                error={errors.under_legal_guardianship}
            />
            <ImageUploadCard
                label="Legal Guardian Document (if applicable)"
                selectedImage={formData.legal_guardian_document}
                onImageSelect={(file) => setFormData({ ...formData, legal_guardian_document: file })}
                error={errors.legal_guardian_document}
            />
            <ImageUploadCard
                label="Signed Undertaking"
                selectedImage={formData.signed_undertaking}
                onImageSelect={(file) => setFormData({ ...formData, signed_undertaking: file })}
                error={errors.signed_undertaking}
            />
            <ImageUploadCard
                label="No Objection Certificate"
                selectedImage={formData.no_objection_certificate}
                onImageSelect={(file) => setFormData({ ...formData, no_objection_certificate: file })}
                error={errors.no_objection_certificate}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 7: Final Declaration & Submit</Text>
            <FormField
                label="I accept the declaration"
                placeholder="Select Yes/No"
                value={formData.declaration_accepted || 'false'}
                onChangeText={(text) => setFormData({ ...formData, declaration_accepted: text })}
                error={errors.declaration_accepted}
            />
            <Text
                className="text-blue-600 underline"
                onPress={() => Linking.openURL('https://example.com/guidelines.pdf')}
            >
                Download Guidelines (PDF)
            </Text>
            <ImageUploadCard
                label="Digital Signature"
                selectedImage={formData.digital_signature}
                onImageSelect={(file) => setFormData({ ...formData, digital_signature: file })}
                error={errors.digital_signature}
            />
        </View>
    );
};

export default VatsalyadhamForm;