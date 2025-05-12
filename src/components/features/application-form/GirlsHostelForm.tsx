import React from 'react';
import { View, Text } from 'react-native'; // Added Text import
import ImageUploadCard from './ImageUploadCard'; // Added ImageUploadCard import
import FormField from './FormField';

interface GirlsHostelFormProps {
    formData: any;
    setFormData: (data: any) => void;
    errors: any;
    setErrors: (errors: any) => void;
}

const GirlsHostelForm: React.FC<GirlsHostelFormProps> = ({ formData, setFormData, errors, setErrors }) => {
    return (
        <View>
            <Text className="text-lg font-semibold text-gray-700 mb-3">Step 1: Applicant Personal Details</Text>
            <FormField
                label="Full Name (as per Aadhaar)"
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
                label="Mobile Number"
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                value={formData.mobileNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
                error={errors.mobileNumber}
            />
            <FormField
                label="Email Address"
                placeholder="Enter your email address"
                keyboardType="email-address"
                value={formData.emailAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, emailAddress: text })}
                error={errors.emailAddress}
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
                label="PAN Number"
                placeholder="Enter your PAN number"
                value={formData.panNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, panNumber: text })}
                error={errors.panNumber}
            />
            <ImageUploadCard
                label="Profile Photo (upload)"
                selectedImage={formData.profilePhoto}
                onImageSelect={(file) => setFormData({ ...formData, profilePhoto: file })}
                error={errors.profilePhoto}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 2: Permanent Address</Text>
            <FormField
                label="Permanent Full Address"
                placeholder="Enter permanent address"
                multiline
                value={formData.permanentAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, permanentAddress: text })}
                error={errors.permanentAddress}
            />
            <FormField
                label="Current Full Address (if different)"
                placeholder="Enter current address"
                multiline
                value={formData.currentAddress || ''}
                onChangeText={(text) => setFormData({ ...formData, currentAddress: text })}
                error={errors.currentAddress}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 3: Educational / Work Details</Text>
            <FormField
                label="Name of College / Company"
                placeholder="Enter name of college or company"
                value={formData.institutionName || ''}
                onChangeText={(text) => setFormData({ ...formData, institutionName: text })}
                error={errors.institutionName}
            />
            <FormField
                label="Course / Job Title"
                placeholder="Enter course or job title"
                value={formData.courseJobTitle || ''}
                onChangeText={(text) => setFormData({ ...formData, courseJobTitle: text })}
                error={errors.courseJobTitle}
            />
            <ImageUploadCard
                label="Upload College/Company ID Card"
                selectedImage={formData.collegeCompanyIdCard}
                onImageSelect={(file) => setFormData({ ...formData, collegeCompanyIdCard: file })}
                error={errors.collegeCompanyIdCard}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 4: Guardian Details</Text>
            <FormField
                label="Father's / Mother's / Guardian’s Full Name"
                placeholder="Enter guardian's full name"
                value={formData.guardianName || ''}
                onChangeText={(text) => setFormData({ ...formData, guardianName: text })}
                error={errors.guardianName}
            />
            <FormField
                label="Guardian's Contact Number"
                placeholder="Enter guardian's contact number"
                keyboardType="phone-pad"
                value={formData.guardianContact || ''}
                onChangeText={(text) => setFormData({ ...formData, guardianContact: text })}
                error={errors.guardianContact}
            />
            <ImageUploadCard
                label="Upload Guardian’s ID Proof (Aadhaar / PAN)"
                selectedImage={formData.guardianIdProof}
                onImageSelect={(file) => setFormData({ ...formData, guardianIdProof: file })}
                error={errors.guardianIdProof}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 6: Document Uploads</Text>
            <ImageUploadCard
                label="Aadhaar Card (Front & Back)"
                selectedImage={formData.aadhaarCard}
                onImageSelect={(file) => setFormData({ ...formData, aadhaarCard: file })}
                error={errors.aadhaarCard}
            />
            <ImageUploadCard
                label="Passport-size Photo"
                selectedImage={formData.passportPhoto}
                onImageSelect={(file) => setFormData({ ...formData, passportPhoto: file })}
                error={errors.passportPhoto}
            />
            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Step 5: Safety & Health Information (Optional)</Text>
            <FormField
                label="Any Known Allergies"
                placeholder="e.g., Dust, Pollen, Peanuts"
                value={formData.allergies || ''}
                onChangeText={(text) => setFormData({ ...formData, allergies: text })}
                error={errors.allergies}
            />
            <FormField
                label="Any Pre-existing Medical Conditions"
                placeholder="e.g., Asthma, Diabetes"
                value={formData.medicalConditions || ''}
                onChangeText={(text) => setFormData({ ...formData, medicalConditions: text })}
                error={errors.medicalConditions}
            />
            <FormField
                label="Emergency Contact Person (Other than Guardian)"
                placeholder="Enter name"
                value={formData.emergencyContactName || ''}
                onChangeText={(text) => setFormData({ ...formData, emergencyContactName: text })}
                error={errors.emergencyContactName}
            />
            <FormField
                label="Emergency Contact Number (Other than Guardian)"
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                value={formData.emergencyContactNumber || ''}
                onChangeText={(text) => setFormData({ ...formData, emergencyContactNumber: text })}
                error={errors.emergencyContactNumber}
            />
        </View>
    );
};

export default GirlsHostelForm;
