// import { supabase } from '@/lib/supabase';
// import { useState, useEffect } from 'react';
// import { decode } from 'base64-arraybuffer';
// import * as FileSystem from 'expo-file-system';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type FamilyMember = {
    uuid: string;
    family_no: number;
    surname: string;
    name: string;
    fathers_or_husbands_name: string;
    father_in_laws_name: string;
    gender: string;
    relationship: string;
    marital_status: string;
    marriage_date: string;
    date_of_birth: string;
    education: string;
    stream: string;
    qualification: string;
    occupation: string;
    email: string;
    profile_pic: string;
    family_cover_pic: string;
    blood_group: string;
    native_place: string;
    residential_address_line1: string;
    residential_address_state: string;
    residential_address_city: string;
    pin_code: string;
    residential_landline: string;
    office_address: string;
    office_address_state: string;
    office_address_city: string;
    office_address_pin: string;
    landline_office: string;
    mobile_no1: string;
    mobile_no2: string;
    date_of_demise: string;
    updated_at: string;
};

type Family = {
    id: number; // family_no
    name: string; // surname + family name
    headName: string; // head of family name
    headImage: string; // head profile pic
    coverImage: string; // family cover pic
    address: string; // residential address
    city: string; // residential address city
    state: string; // residential address state
    pinCode: string; // pin code
    totalMembers: number; // count of members
    members: FamilyMember[]; // array of family members
};

type UseQueryResult<T> = {
    data: T | null;
    error: Error | null;
    loading: boolean;
};



// Use Families Hook



export const useFamilies = (page = 1, pageSize = 12, searchQuery = "") => {
    const [result, setResult] = useState<
        UseQueryResult<{ families: Family[]; count: number }>
    >({
        data: null,
        error: null,
        loading: true,
    });

    const fetchFamilies = async () => {
        try {
            setResult((prev) => ({ ...prev, loading: true }));

            // Step 1: First fetch distinct family numbers with pagination
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1; // Changed to be inclusive upper bound

            // Query to get distinct family numbers
            let familyQuery = supabase
                .from("profiles")
                .select("family_no,count()", { count: "exact" })
                .not("family_no", "is", null)
                .order("family_no", { ascending: true })

                .range(from, to);

            // Add search filter if provided
            if (searchQuery) {
                familyQuery = supabase
                    .from("profiles")
                    .select("family_no,count()", { count: "exact" })
                    .not("family_no", "is", null)
                    .or(`name.ilike.%${searchQuery}%,surname.ilike.%${searchQuery}%`)
                    .order("family_no", { ascending: true })
                    .range(from, to);
            }

            const { data: familyNos, error: familyError, count } = await familyQuery;

            if (familyError) throw familyError;

            if (!familyNos || familyNos.length === 0) {
                setResult({
                    data: { families: [], count: 0 },
                    error: null,
                    loading: false,
                });
                return;
            }

            // Step 2: Fetch all profiles for these family numbers
            const uniqueFamilyNos = [...new Set(familyNos.map((f) => f.family_no))];

            const { data: profilesData, error: profilesError } = await supabase
                .from("profiles")
                .select("*")
                .in("family_no", uniqueFamilyNos);

            if (profilesError) throw profilesError;

            // Step 3: Group profiles by family_no and process them
            const familyGroups: Record<string, any[]> = {};

            // Group profiles by family_no
            profilesData?.forEach((profile) => {
                if (!profile.family_no) return;

                if (!familyGroups[profile.family_no]) {
                    familyGroups[profile.family_no] = [];
                }
                familyGroups[profile.family_no].push(profile);
            });

            // Process each family group
            const processedFamilies = uniqueFamilyNos
                .filter((familyNo) => familyGroups[familyNo])
                .map((familyNo) => {
                    const members = familyGroups[familyNo];

                    // Find the head of the family (assuming it's the first member or one with relationship = "Self")
                    const headMember =
                        members.find((m) => m.relationship?.toLowerCase() === "self") ||
                        members[0];

                    // Create family members list
                    const membersList: FamilyMember[] = members.map((member) => ({
                        uuid: member.id.toString(),
                        family_no: member.family_no || 0,
                        surname: member.surname || "",
                        name: member.name || "",
                        fathers_or_husbands_name: member.fathers_or_husbands_name || "",
                        father_in_laws_name: member.father_in_laws_name || "",
                        gender: member.gender || "",
                        relationship: member.relationship || "",
                        marital_status: member.marital_status || "",
                        marriage_date: member.marriage_date || "",
                        date_of_birth: member.date_of_birth || "",
                        education: member.education || "",
                        stream: member.stream || "",
                        qualification: member.qualification || "",
                        occupation: member.occupation || "",
                        email: member.email || "",
                        profile_pic:
                            member.profile_pic ||
                            "https://kmxrfddgzveqlmsvmsub.supabase.co/storage/v1/object/public/extras//user.png",
                        family_cover_pic: member.family_cover_pic || "",
                        blood_group: member.blood_group || "",
                        native_place: member.native_place || "",
                        residential_address_line1: member.residential_address_line1 || "",
                        residential_address_state: member.residential_address_state || "",
                        residential_address_city: member.residential_address_city || "",
                        pin_code: member.pin_code || "",
                        residential_landline: member.residential_landline || "",
                        office_address: member.office_address || "",
                        office_address_state: member.office_address_state || "",
                        office_address_city: member.office_address_city || "",
                        office_address_pin: member.office_address_pin || "",
                        landline_office: member.landline_office || "",
                        mobile_no1: member.mobile_no1 || "",
                        mobile_no2: member.mobile_no2 || "",
                        date_of_demise: member.date_of_demise || "",
                        updated_at: member.updated_at || "",
                    }));

                    return {
                        id: familyNo,
                        name: `${headMember.surname || ""} Family`,
                        headName: `${headMember.name} ${headMember.surname || ""}`.trim(),
                        headImage:
                            headMember.profile_pic ||
                            "https://kmxrfddgzveqlmsvmsub.supabase.co/storage/v1/object/public/extras//user.png",
                        coverImage:
                            headMember.family_cover_pic ||
                            "https://kmxrfddgzveqlmsvmsub.supabase.co/storage/v1/object/public/extras//fam.png",
                        address: headMember.residential_address_line1 || "",
                        city: headMember.residential_address_city || "",
                        state: headMember.residential_address_state || "",
                        totalMembers: members.length,
                        members: membersList,
                    };
                });

            setResult({
                data: {
                    families: processedFamilies.map((family) => ({
                        ...family,
                        pinCode: family.members[0]?.pin_code || "", // Add pinCode from the first member
                    })),
                    count: count || 0,
                },
                error: null,
                loading: false,
            });
        } catch (error) {
            setResult({
                data: null,
                error: error as Error,
                loading: false,
            });
        }
    };

    useEffect(() => {
        fetchFamilies();
    }, [page, pageSize, searchQuery]);

    return { ...result, refetch: fetchFamilies };
};