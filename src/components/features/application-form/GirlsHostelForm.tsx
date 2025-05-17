import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; // Added Text import
import ImageUploadCard from './ImageUploadCard'; // Added ImageUploadCard import
import FormField from './FormField';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface GirlsHostelFormProps {
    formData: any;
    setFormData: (data: any) => void;
    errors: any;
    setErrors: (errors: any) => void;
}

const GirlsHostelForm: React.FC<GirlsHostelFormProps> = ({ formData, setFormData, errors, setErrors }) => {

    // Add test data function
    const fillTestData = () => {
        const testData = {
            // Personal Details
            full_name: "Test User",
            date_of_birth: "2000-01-01",
            gender: "Male",
            marital_status: "Single",
            nationality: "Indian",
            mobile_number: "9876543210",
            email_id: "test@example.com",
            aadhaar_number: "123456789012",
            pan_number: "ABCDE1234F",
            blood_group: "O+",

            // Address Information
            permanent_address: "123 Test Street",
            permanent_city: "Mumbai",
            permanent_state: "Maharashtra",
            permanent_pincode: "400080",
            current_address: "456 Test Avenue",
            current_city: "Mumbai",
            current_state: "Maharashtra",
            current_pincode: "400081",

            // Academic/Employment Details
            education_level: "Graduate",
            institution_name: "Test University",
            course_or_designation: "B.Tech",
            year_of_study: "3",
            employment_status: "Student",
            college_or_company: "",
            work_experience: "",

            // Guardian Information
            guardian_name: "Test Parent",
            guardian_relation: "Father",
            guardian_mobile: "9876543211",
            guardian_email: "parent@example.com",
            guardian_address: "789 Test Road, Mumbai",
            guardian_occupation: "Business",

            // Health Details
            health_conditions: "None",
            medications: "None",
            emergency_contact_name: "Test Emergency",
            emergency_contact_number: "9876543212",

            // Declaration
            declaration_date: new Date().toISOString().split('T')[0],
            declaration_signed: true
        };
        setFormData({ ...formData, ...testData });
    };
    const [date_of_birth_show, setDateOfBirthShow] = React.useState(false);
    const [declaration_date_show, setDeclarationDateShow] = React.useState(false);

    // Function to show date picker
    const showDatePicker = (field: string) => {
        if (field === 'date_of_birth') setDateOfBirthShow(true);
        if (field === 'declaration_date') setDeclarationDateShow(true);
    };

    // Handle date selection
    const onDateChange = (field: string, event: any, selectedDate?: Date) => {
        if (field === 'date_of_birth') setDateOfBirthShow(false);
        if (field === 'declaration_date') setDeclarationDateShow(false);

        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, [field]: formattedDate }));
        }
    };

    const genderOptions = ["Female"];
    const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const educationLevelOptions = ["High School", "Diploma", "Graduate", "Post Graduate", "Doctorate"];
    const employmentStatusOptions = ["Student", "Employed", "Self-employed", "Unemployed"];
    const booleanOptions = ["true", "false"];
    const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];


    const DropdownField = ({ label, options, value, onValueChange, error }: any) => (
        <View className="mb-4">
            <Text className="text-gray-700 mb-1">{label}</Text>
            <View className="border border-gray-300 rounded-md overflow-hidden">
                <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onValueChange(itemValue)}
                    style={{ height: 50, width: '100%' }}
                >
                    <Picker.Item label="Select..." value="" />
                    {options.map((option: string) => (
                        <Picker.Item key={option} label={option} value={option} />
                    ))}
                </Picker>
            </View>
            {error && <Text className="text-red-500 mt-1">{error}</Text>}
        </View>
    );

    const DateField = ({ label, value, onPress, error }: any) => (
        <View className="mb-4">
            <Text className="text-gray-700 mb-1">{label}</Text>
            <TouchableOpacity
                onPress={onPress}
                className="border border-gray-300 rounded-md p-3 flex-row justify-between items-center"
            >
                <Text className={value ? "text-black" : "text-gray-400"}>
                    {value || "YYYY-MM-DD"}
                </Text>
                <Text className="text-blue-500">📅</Text>
            </TouchableOpacity>
            {error && <Text className="text-red-500 mt-1">{error}</Text>}
        </View>
    );

    const renderDatePickers = () => {
        return (
            <>
                {date_of_birth_show && (
                    <DateTimePicker
                        value={formData['date_of_birth'] ? new Date(formData['date_of_birth']) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => onDateChange('date_of_birth', event, selectedDate)}
                    />
                )}
                {declaration_date_show && (
                    <DateTimePicker
                        value={formData['declaration_date'] ? new Date(formData['declaration_date']) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => onDateChange('declaration_date', event, selectedDate)}
                    />
                )}
            </>
        );
    };

    return (
        <View>
            {/* <TouchableOpacity
                onPress={fillTestData}
                className="bg-gray-200 py-2 px-4 rounded-lg mb-4"
            >
                <Text className="text-gray-700 text-center">Fill Test Data</Text>
            </TouchableOpacity> */}
            <Text className="text-lg font-semibold text-gray-700 mb-3">Section 1: Personal Details</Text>
            <FormField
                label="Full Name (as per Aadhaar)"
                placeholder="Enter your full name"
                value={formData.full_name || ''}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                error={errors.full_name}
            />
            <DateField
                label="Date of Birth"
                value={formData.date_of_birth || ''}
                onPress={() => showDatePicker('date_of_birth')}
                error={errors.date_of_birth}
            />
            <DropdownField
                label="Gender"
                options={genderOptions}
                value={formData.gender || 'Female'}
                onValueChange={(value: string) => setFormData({ ...formData, gender: value })}
                error={errors.gender}
            />
            <DropdownField
                label="Marital Status"
                options={maritalStatusOptions}
                value={formData.marital_status || ''}
                onValueChange={(value: string) => setFormData({ ...formData, marital_status: value })}
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
            <DropdownField
                label="Blood Group"
                options={bloodGroupOptions}
                value={formData.blood_group || ''}
                onValueChange={(value: string) => setFormData({ ...formData, blood_group: value })}
                error={errors.blood_group}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 2: Address Information</Text>
            <FormField
                label="Permanent Address"
                placeholder="Enter your permanent address"
                multiline
                value={formData.permanent_address || ''}
                onChangeText={(text) => setFormData({ ...formData, permanent_address: text })}
                error={errors.permanent_address}
            />
            <FormField
                label="Permanent City"
                placeholder="Enter city"
                value={formData.permanent_city || ''}
                onChangeText={(text) => setFormData({ ...formData, permanent_city: text })}
                error={errors.permanent_city}
            />
            <FormField
                label="Permanent State"
                placeholder="Enter state"
                value={formData.permanent_state || ''}
                onChangeText={(text) => setFormData({ ...formData, permanent_state: text })}
                error={errors.permanent_state}
            />
            <FormField
                label="Permanent Pincode"
                placeholder="Enter pincode"
                keyboardType="numeric"
                value={formData.permanent_pincode || ''}
                onChangeText={(text) => setFormData({ ...formData, permanent_pincode: text })}
                error={errors.permanent_pincode}
            />
            <FormField
                label="Current Address (if different from permanent)"
                placeholder="Enter your current address"
                multiline
                value={formData.current_address || ''}
                onChangeText={(text) => setFormData({ ...formData, current_address: text })}
                error={errors.current_address}
            />
            <FormField
                label="Current City"
                placeholder="Enter city"
                value={formData.current_city || ''}
                onChangeText={(text) => setFormData({ ...formData, current_city: text })}
                error={errors.current_city}
            />
            <FormField
                label="Current State"
                placeholder="Enter state"
                value={formData.current_state || ''}
                onChangeText={(text) => setFormData({ ...formData, current_state: text })}
                error={errors.current_state}
            />
            <FormField
                label="Current Pincode"
                placeholder="Enter pincode"
                keyboardType="numeric"
                value={formData.current_pincode || ''}
                onChangeText={(text) => setFormData({ ...formData, current_pincode: text })}
                error={errors.current_pincode}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 3: Academic/Employment Details</Text>
            <DropdownField
                label="Education Level"
                options={educationLevelOptions}
                value={formData.education_level || ''}
                onValueChange={(value: string) => setFormData({ ...formData, education_level: value })}
                error={errors.education_level}
            />
            <FormField
                label="Institution Name"
                placeholder="Enter institution name"
                value={formData.institution_name || ''}
                onChangeText={(text) => setFormData({ ...formData, institution_name: text })}
                error={errors.institution_name}
            />
            <FormField
                label="Course Name"
                placeholder="Enter course name"
                value={formData.course_or_designation || ''}
                onChangeText={(text) => setFormData({ ...formData, course_or_designation: text })}
                error={errors.course_or_designation}
            />
            <FormField
                label="Year of Study"
                placeholder="Enter year of study"
                value={formData.year_of_study || ''}
                onChangeText={(text) => setFormData({ ...formData, year_of_study: text })}
                error={errors.year_of_study}
            />
            <DropdownField
                label="Employment Status"
                options={employmentStatusOptions}
                value={formData.employment_status || ''}
                onValueChange={(value: string) => setFormData({ ...formData, employment_status: value })}
                error={errors.employment_status}
            />
            <FormField
                label="Company Name (if employed)"
                placeholder="Enter company name"
                value={formData.college_or_company || ''}
                onChangeText={(text) => setFormData({ ...formData, college_or_company: text })}
                error={errors.college_or_company}
            />
            <FormField
                label="Work Experience (in years, if employed)"
                placeholder="Enter work experience"
                value={formData.work_experience || ''}
                onChangeText={(text) => setFormData({ ...formData, work_experience: text })}
                error={errors.work_experience}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 4: Guardian Information</Text>
            <FormField
                label="Guardian's Full Name"
                placeholder="Enter guardian's name"
                value={formData.guardian_name || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_name: text })}
                error={errors.guardian_name}
            />
            <FormField
                label="Relationship with Guardian"
                placeholder="Enter relationship"
                value={formData.guardian_relation || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_relation: text })}
                error={errors.guardian_relation}
            />
            <FormField
                label="Guardian's Mobile Number"
                placeholder="Enter guardian's mobile number"
                keyboardType="phone-pad"
                value={formData.guardian_mobile || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_mobile: text })}
                error={errors.guardian_mobile}
            />
            <FormField
                label="Guardian's Email ID"
                placeholder="Enter guardian's email ID"
                keyboardType="email-address"
                value={formData.guardian_email || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_email: text })}
                error={errors.guardian_email}
            />
            <FormField
                label="Guardian's Address"
                placeholder="Enter guardian's address"
                multiline
                value={formData.guardian_address || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_address: text })}
                error={errors.guardian_address}
            />
            <FormField
                label="Guardian's Occupation"
                placeholder="Enter guardian's occupation"
                value={formData.guardian_occupation || ''}
                onChangeText={(text) => setFormData({ ...formData, guardian_occupation: text })}
                error={errors.guardian_occupation}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 5: Health Details</Text>
            <FormField
                label="Health Conditions (if any)"
                placeholder="Enter health conditions"
                value={formData.health_conditions || ''}
                onChangeText={(text) => setFormData({ ...formData, health_conditions: text })}
                error={errors.health_conditions}
            />
            <FormField
                label="Regular Medications (if any)"
                placeholder="Enter medications"
                multiline
                value={formData.medications || ''}
                onChangeText={(text) => setFormData({ ...formData, medications: text })}
                error={errors.medications}
            />
            <FormField
                label="Emergency Contact Name"
                placeholder="Enter emergency contact name"
                value={formData.emergency_contact_name || ''}
                onChangeText={(text) => setFormData({ ...formData, emergency_contact_name: text })}
                error={errors.emergency_contact_name}
            />
            <FormField
                label="Emergency Contact Number"
                placeholder="Enter emergency contact number"
                keyboardType="phone-pad"
                value={formData.emergency_contact_number || ''}
                onChangeText={(text) => setFormData({ ...formData, emergency_contact_number: text })}
                error={errors.emergency_contact_number}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 6: Document Uploads</Text>
            <ImageUploadCard
                label="Recent Photograph"
                selectedImage={formData.photograph}
                onImageSelect={(file) => setFormData({ ...formData, photograph: file })}
                error={errors.photograph}
            />
            <ImageUploadCard
                label="Aadhaar Card"
                selectedImage={formData.aadhaar_card}
                onImageSelect={(file) => setFormData({ ...formData, aadhaar_card: file })}
                error={errors.aadhaar_card}
            />
            <ImageUploadCard
                label="PAN Card"
                selectedImage={formData.pan_card}
                onImageSelect={(file) => setFormData({ ...formData, pan_card: file })}
                error={errors.pan_card}
            />
            <ImageUploadCard
                label="Student ID/Employee ID"
                selectedImage={formData.id_proof}
                onImageSelect={(file) => setFormData({ ...formData, id_proof: file })}
                error={errors.id_proof}
            />
            <ImageUploadCard
                label="Guardian's ID Proof"
                selectedImage={formData.guardian_id_proof}
                onImageSelect={(file) => setFormData({ ...formData, guardian_id_proof: file })}
                error={errors.guardian_id_proof}
            />

            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-3">Section 7: Declaration</Text>
            <DateField
                label="Declaration Date"
                value={formData.declaration_date || ''}
                onPress={() => showDatePicker('declaration_date')}
                error={errors.declaration_date}
            />
            <DropdownField
                label="Declaration Signed"
                options={booleanOptions}
                value={formData.declaration_signed ? 'true' : 'false'}
                onValueChange={(value: string) => setFormData({ ...formData, declaration_signed: value === 'true' })}
                error={errors.declaration_signed}
            />
            {renderDatePickers()}
        </View>
    );
};

export default GirlsHostelForm;
