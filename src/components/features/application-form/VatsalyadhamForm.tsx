import React from 'react';
import { View, Text } from 'react-native'; // Added Text import
import ImageUploadCard from './ImageUploadCard'; // Added ImageUploadCard import
import FormField from './FormField';

interface VatsalyadhamFormProps {
    formData: any;
    setFormData: (data: any) => void;
    errors: any;
    setErrors: (errors: any) => void;
}

const VatsalyadhamForm: React.FC<VatsalyadhamFormProps> = ({ formData, setFormData, errors, setErrors }) => {
    return (
        <View>
            <Text className="text-lg font-semibold text-gray-700 mb-3">Step 1: Personal Details of the Elderly Applicant</Text>
            <FormField
                label="Full Name (as per Aadhaar)"
                placeholder="Enter applicant's full name"
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
                label="Blood Group"
                placeholder="Enter blood group"
                value={formData.bloodGroup || ''}
                onChangeText={(text) => setFormData({ ...formData, bloodGroup: text })}
                error={errors.bloodGroup}
            />
            <FormField
                label="Mobile Number (if applicable)"
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                value={formData.mobileNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
                error={errors.mobileNumber}
            />
            <FormField
                label="Email Address (optional)"
                placeholder="Enter email address"
                keyboardType="email-address"
                value={formData.emailAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, emailAddress: text })}
                error={errors.emailAddress}
            />
            <FormField
                label="Aadhaar Number"
                placeholder="Enter Aadhaar number"
                keyboardType="numeric"
                value={formData.aadhaarNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, aadhaarNumber: text })}
                error={errors.aadhaarNumber}
            />
            <ImageUploadCard
                label="Recent Photo (upload)"
                selectedImage={formData.recentPhoto}
                onImageSelect={(file) => setFormData({ ...formData, recentPhoto: file })}
                error={errors.recentPhoto}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 2: Current Residential Details</Text>
            <FormField
                label="Full Address"
                placeholder="Enter full address"
                multiline
                value={formData.fullAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, fullAddress: text })}
                error={errors.fullAddress}
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
            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 3: Health Details</Text>
            <FormField
                label="Major Illnesses / Chronic Conditions"
                placeholder="e.g., Diabetes, Hypertension, Arthritis"
                multiline
                value={formData.majorIllnesses || ''}
                onChangeText={(text) => setFormData({ ...formData, majorIllnesses: text })}
                error={errors.majorIllnesses}
            />
            <FormField
                label="Regular Medications (with dosage)"
                placeholder="List medications and dosages"
                multiline
                value={formData.regularMedications || ''}
                onChangeText={(text) => setFormData({ ...formData, regularMedications: text })}
                error={errors.regularMedications}
            />
            <FormField
                label="Any Known Allergies"
                placeholder="e.g., Food, Medicine, Dust"
                value={formData.allergies || ''}
                onChangeText={(text) => setFormData({ ...formData, allergies: text })}
                error={errors.allergies}
            />
            <FormField
                label="Mobility (Ambulant / Wheelchair / Bedridden)"
                placeholder="Select mobility status"
                value={formData.mobility || ''}
                onChangeText={(text) => setFormData({ ...formData, mobility: text })}
                error={errors.mobility}
            />
            <ImageUploadCard
                label="Medical Reports / Doctor's Certificate (upload)"
                selectedImage={formData.medicalReports}
                onImageSelect={(file) => setFormData({ ...formData, medicalReports: file })}
                error={errors.medicalReports}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 4: Guardian / Next of Kin Details</Text>
            <FormField
                label="Guardian's / Next of Kin's Full Name"
                placeholder="Enter full name"
                value={formData.guardianName || ''}
                onChangeText={(text) => setFormData({ ...formData, guardianName: text })}
                error={errors.guardianName}
            />
            <FormField
                label="Relationship with Applicant"
                placeholder="e.g., Son, Daughter, Spouse"
                value={formData.guardianRelation || ''}
                onChangeText={(text) => setFormData({ ...formData, guardianRelation: text })}
                error={errors.guardianRelation}
            />
            <FormField
                label="Guardian's Contact Number"
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                value={formData.guardianContact || ''}
                onChangeText={(text) => setFormData({ ...formData, guardianContact: text })}
                error={errors.guardianContact}
            />
            <FormField
                label="Guardian's Email Address (optional)"
                placeholder="Enter email address"
                keyboardType="email-address"
                value={formData.guardianEmail || ''}
                onChangeText={(text) => setFormData({ ...formData, guardianEmail: text })}
                error={errors.guardianEmail}
            />
            <FormField
                label="Guardian's Full Address"
                placeholder="Enter guardian's full address"
                multiline
                value={formData.guardianAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, guardianAddress: text })}
                error={errors.guardianAddress}
            />
            <ImageUploadCard
                label="Guardian's ID Proof (Aadhaar/PAN - upload)"
                selectedImage={formData.guardianIdProof}
                onImageSelect={(file) => setFormData({ ...formData, guardianIdProof: file })}
                error={errors.guardianIdProof}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 5: Financial Details (Optional)</Text>
            <FormField
                label="Source of Income / Pension (if any)"
                placeholder="e.g., Government Pension, FD Interest"
                value={formData.sourceOfIncome || ''}
                onChangeText={(text) => setFormData({ ...formData, sourceOfIncome: text })}
                error={errors.sourceOfIncome}
            />
            <FormField
                label="Monthly Income / Pension Amount"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={formData.monthlyIncome || ''}
                onChangeText={(text) => setFormData({ ...formData, monthlyIncome: text })}
                error={errors.monthlyIncome}
            />
            <ImageUploadCard
                label="Proof of Income / Pension (upload)"
                selectedImage={formData.incomeProof}
                onImageSelect={(file) => setFormData({ ...formData, incomeProof: file })}
                error={errors.incomeProof}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 6: Document Uploads</Text>
            <ImageUploadCard
                label="Aadhaar Card (Applicant - Front & Back)"
                selectedImage={formData.aadhaarCardApplicant}
                onImageSelect={(file) => setFormData({ ...formData, aadhaarCardApplicant: file })}
                error={errors.aadhaarCardApplicant}
            />
            {/* Recent Photo is already in Step 1 */}
            {/* Medical Reports are in Step 3 */}
            {/* Guardian ID Proof is in Step 4 */}
            {/* Proof of Income/Pension is in Step 5 */}
        </View>
    );
};

export default VatsalyadhamForm;
