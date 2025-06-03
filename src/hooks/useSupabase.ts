// import { supabase } from '@/lib/supabase';
// import { useState, useEffect } from 'react';
// import { decode } from 'base64-arraybuffer';
// import * as FileSystem from 'expo-file-system';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// // Form Types
// interface EventFormData {
//     userId: string;
//     name: string;
//     description: string;
//     startTime: string;
//     duration: string;
//     organizers: string[];  // Changed to string array
//     image?: File;
// }



// // Event Types
// interface Event {
//     time: string;
//     date: string;
//     id: string;
//     user_id: string;
//     title: string;
//     description: string;
//     event_date: string;
//     start_time: string;
//     end_time: string;
//     location: string;
//     city: string;
//     organizer_name: string;
//     contact_email: string;
//     contact_phone: string;
//     website: string;
//     created_at: string;
//     image?: string;
// }

// interface FamilyMember {
//     id: string;
//     name: string;
//     profile_pic: string;
//     relationship: string;
//     occupation: string;
// }

// interface HeadOfFamily {
//     name: string;
//     profile_pic: string;
//     occupation: string;
// }

// interface FamilyData {
//     family_no: string;
//     family_cover_pic: string;
//     surname: string;
//     address: string;
//     head_of_family: HeadOfFamily;
//     familyMembers: FamilyMember[];
// }


// interface DonationFormData {
//     userId: string;
//     amount: number;
//     description: string;
//     cause: string;
//     openTill: string;
//     image?: File;
// }

// // Types
// type Profile = {
//     id: number;
//     family_no: string;
//     surname: string;
//     name: string;
//     fathers_or_husbands_name: string;
//     father_in_laws_name: string;
//     gender: string;
//     relationship: string;
//     marital_status: string;
//     marriage_date: string;
//     date_of_birth: string;
//     education: string;
//     stream: string;
//     qualification: string;
//     occupation: string;
//     email: string;
//     profile_pic: string;
//     family_cover_pic: string;
//     blood_group: string;
//     native_place: string;
//     residential_address_line1: string;
//     residential_address_state: string;
//     residential_address_city: string;
//     pin_code: string;
//     residential_landline: string;
//     office_address: string;
//     office_address_state: string;
//     office_address_city: string;
//     office_address_pin: string;
//     landline_office: string;
//     mobile_no1: string;
//     mobile_no2: string;
//     date_of_demise: string;
// };

// type UseQueryResult<T> = {
//     data: T | null;
//     error: Error | null;
//     loading: boolean;
// };

// type Committee = {
//     id: number;
//     created_at: string;
//     name: string;
//     phone: string;
//     location: string;
//     member_name: string;
// };

// // Hooks for Profile-related queries
// export const useProfiles = () => {
//     const [result, setResult] = useState<UseQueryResult<Profile[]>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchProfiles = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));
//             const { data, error } = await supabase
//                 .from('profiles')
//                 .select('*');

//             if (error) throw error;

//             setResult({
//                 data,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     return { ...result, refetch: fetchProfiles };
// };

// export const useProfile = (id: number) => {
//     const [result, setResult] = useState<UseQueryResult<Profile>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchProfile = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));
//             const { data, error } = await supabase
//                 .from('profiles')
//                 .select('*')
//                 .eq('id', id)
//                 .single();

//             if (error) throw error;

//             setResult({
//                 data,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     useEffect(() => {
//         fetchProfile();
//     }, [id]);

//     return { ...result, refetch: fetchProfile };
// };


// // Form submission hooks
// export const useFormSubmission = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const uploadImage = async (file: any, id: number) => {
//         try {
//             const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
//             const fileExtension = file.mimeType.split('/')[1];
//             const filePath = `${id}.${fileExtension}`;
//             const contentType = file.mimeType;
//             const { data, error } = await supabase
//                 .storage
//                 .from('application-pictures')
//                 .upload(filePath, decode(base64), { contentType })
//             if (error) {
//                 console.error(error);
//                 throw error;
//             }
//             return data.path;
//         } catch (error: any) {
//             throw new Error(error);

//         }
//     };

//     const submitEvent = async (formData: EventFormData) => {
//         setLoading(true);
//         setError(null);

//         try {
//             // Convert organizers array to PostgreSQL array format
//             const organizersArray = `{${formData.organizers.join(',')}}`;

//             // First submit the event data without image
//             const { data: eventData, error: insertError } = await supabase
//                 .from('event_applications')
//                 .insert([
//                     {
//                         user_id: formData.userId,
//                         name: formData.name,
//                         description: formData.description,
//                         start_at: formData.startTime,
//                         duration: formData.duration,
//                         organizers: organizersArray,
//                     }
//                 ])
//                 .select();

//             if (insertError) throw insertError;

//             // Then upload image if exists using the event ID
//             let imagePath = null;
//             if (formData.image && eventData?.[0]?.id) {

//                 imagePath = await uploadImage(formData.image, eventData[0].id);

//                 // Update the event with image path
//                 const { error: updateError } = await supabase
//                     .from('event_applications')
//                     .update({ image_url: imagePath })
//                     .eq('id', eventData[0].id);

//                 if (updateError) throw updateError;
//             }

//             return true;
//         } catch (error: any) {
//             setError(error.message);
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const submitDonation = async (formData: DonationFormData) => {
//         setLoading(true);
//         setError(null);

//         try {
//             // First submit the donation data without image
//             const { data: donationData, error: insertError } = await supabase
//                 .from('donation_applications')
//                 .insert([
//                     {
//                         user_id: formData.userId,
//                         amount: formData.amount,
//                         description: formData.description,
//                         cause: formData.cause,
//                         open_till: formData.openTill,
//                     }
//                 ])
//                 .select();

//             if (insertError) throw insertError;

//             // Then upload image if exists using the donation ID
//             let imagePath = null;
//             if (formData.image && donationData?.[0]?.id) {
//                 imagePath = await uploadImage(formData.image, donationData[0].id);

//                 // Update the donation with image path
//                 const { error: updateError } = await supabase
//                     .from('donation_applications')
//                     .update({ image_url: imagePath })
//                     .eq('id', donationData[0].id);

//                 if (updateError) throw updateError;
//             }

//             return true;
//         } catch (error: any) {
//             setError(error.message);
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         loading,
//         error,
//         submitEvent,
//         submitDonation
//     };
// };

// export const useBirthdays = (filter: 'today' | 'month' | 'all' = 'all') => {
//     const [result, setResult] = useState<UseQueryResult<any[]>>({  // Changed from Profile[] to any[]
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchBirthdays = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));

//             const { data, error } = await supabase
//                 .from('profiles')
//                 .select('name, surname, date_of_birth, profile_pic, mobile_no1, email')
//                 .not('date_of_birth', 'is', null);

//             if (error) throw error;

//             // Transform and filter the data
//             const now = new Date();
//             const currentMonth = now.getMonth();
//             const currentDay = now.getDate();

//             const monthAbbreviations = [
//                 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//             ];

//             const transformedData = data
//                 .map(profile => {
//                     if (!profile.date_of_birth) return null;

//                     try {
//                         // More robust date parsing
//                         const parts = profile.date_of_birth.split('/');
//                         if (parts.length !== 3) return null;

//                         const [day, monthAbbr, yearPart] = parts;
//                         const monthIndex = monthAbbreviations.findIndex(
//                             m => m.toLowerCase() === monthAbbr.toLowerCase()
//                         );

//                         if (monthIndex === -1) return null;

//                         const parsedDay = parseInt(day);
//                         if (isNaN(parsedDay)) return null;

//                         let fullYear = parseInt(yearPart);
//                         if (isNaN(fullYear)) return null;

//                         if (yearPart.length === 2) {
//                             fullYear = fullYear < 50 ? 2000 + fullYear : 1900 + fullYear;
//                         }

//                         const birthDate = new Date(fullYear, monthIndex, parsedDay);
//                         let age = now.getFullYear() - birthDate.getFullYear();

//                         if (
//                             now.getMonth() < monthIndex ||
//                             (now.getMonth() === monthIndex && now.getDate() < parsedDay)
//                         ) {
//                             age--;
//                         }

//                         const displayDate = new Date(
//                             now.getFullYear(),
//                             monthIndex,
//                             parsedDay
//                         ).toLocaleDateString('en-US', {
//                             month: 'long',
//                             day: 'numeric',
//                         });

//                         return {
//                             id: `${profile.name}-${profile.date_of_birth}`,
//                             name: `${profile.name} ${profile.surname || ''}`.trim(),
//                             age: age.toString(),
//                             date: displayDate,
//                             image: profile.profile_pic || 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
//                             phone: profile.mobile_no1,
//                             email: profile.email,
//                             monthIndex,
//                             day: parsedDay,
//                         };
//                     } catch (e) {
//                         console.error('Error parsing date:', profile.date_of_birth, e);
//                         return null;
//                     }
//                 })
//                 .filter(Boolean)
//                 .filter(birthday => {
//                     if (filter === 'today') {
//                         return birthday.monthIndex === currentMonth && birthday.day === currentDay;
//                     } else if (filter === 'month') {
//                         return birthday.monthIndex === currentMonth;
//                     }
//                     return true;
//                 })
//                 .sort((a, b) => {
//                     if (a.monthIndex !== b.monthIndex) {
//                         return a.monthIndex - b.monthIndex;
//                     }
//                     return a.day - b.day;
//                 });

//             setResult({
//                 data: transformedData, // Removed the type casting
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             console.error('Error fetching birthdays:', error);
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     useEffect(() => {
//         fetchBirthdays();
//     }, [filter]);

//     return { ...result, refetch: fetchBirthdays };
// };

// export const useFamilyVerification = (email: string) => {
//     const [result, setResult] = useState<UseQueryResult<Profile[]>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const verifyUserEmail = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));
//             const { data, error } = await supabase
//                 .from('profiles')
//                 .select('*')
//                 .eq('email', email);

//             if (error) throw error;

//             setResult({
//                 data,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     useEffect(() => {
//         if (email) {
//             verifyUserEmail();
//         }
//     }, [email]);

//     return { ...result, refetch: verifyUserEmail };
// };


// export const useCommittees = () => {
//     const [result, setResult] = useState<UseQueryResult<Committee[]>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchCommittees = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));
//             const { data, error } = await supabase
//                 .from('committee')  // Make sure this matches your table name exactly
//                 .select('*')
//                 .order('created_at', { ascending: false });

//             if (error) throw error;

//             setResult({
//                 data,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     useEffect(() => {
//         fetchCommittees();
//     }, []);

//     return { ...result, refetch: fetchCommittees };
// };



// // Add this type to your existing types
// type CommitteeImage = {
//     name: string;
//     url: string;
//     created_at: string;
//     size: number;
//     contentType: string;
// };

// // Add this hook to your existing hooks
// export const useCommitteeImages = () => {
//     const [result, setResult] = useState<UseQueryResult<CommitteeImage[]>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchCommitteeImages = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));

//             // List all files in the committee_pictures bucket
//             const { data: files, error } = await supabase
//                 .storage
//                 .from('committee-pictures')
//                 .list();

//             if (error) throw error;

//             // Get public URLs for each image
//             const images = await Promise.all(
//                 files.map(async (file) => {
//                     const { data: { publicUrl } } = supabase
//                         .storage
//                         .from('committee-pictures')
//                         .getPublicUrl(file.name);

//                     return {
//                         name: file.name,
//                         url: publicUrl,
//                         created_at: file.created_at,
//                         size: file.metadata?.size || 0,
//                         contentType: file.metadata?.mimetype || 'image/jpeg',
//                     };
//                 })
//             );

//             setResult({
//                 data: images,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     useEffect(() => {
//         fetchCommitteeImages();
//     }, []);

//     return { ...result, refetch: fetchCommitteeImages };
// };



// // Add this type to your existing types
// type Doctor = {
//     id: number;
//     name: string;
//     specialization: string;
//     qualification: string;
//     experience_years: number;
//     clinic_address: string;
//     contact_email: string;
//     contact_phone: string;
//     available_timings: string;
//     created_at: string;
// };

// // Add this hook to your existing hooks
// export const useDoctors = () => {
//     const [result, setResult] = useState<UseQueryResult<Doctor[]>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchDoctors = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));
//             const { data, error } = await supabase
//                 .from('doctors')
//                 .select('*')
//                 .order('created_at', { ascending: false });

//             if (error) throw error;

//             setResult({
//                 data,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     useEffect(() => {
//         fetchDoctors();
//     }, []);

//     return { ...result, refetch: fetchDoctors };
// };



// // Add this type to your existing types
// type ShubhChintak = {
//     id: number;
//     created_at: string;
//     file_url: string;
//     title: string;
//     cover_image_name: string;
//     cover_image_url?: string; // This will be added after fetching from storage
// };



// // Update the useShubhChintak hook
// export const useShubhChintak = (limit?: number) => {
//     const [result, setResult] = useState<UseQueryResult<ShubhChintak[]>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchShubhChintak = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));

//             // 1. Fetch magazine data from the table
//             let query = supabase
//                 .from('shubh_chintak')
//                 .select('*')
//                 .order('created_at', { ascending: false });

//             if (limit) {
//                 query = query.limit(limit);
//             }

//             const { data: magazines, error: tableError } = await query;

//             if (tableError) throw tableError;

//             if (!magazines || magazines.length === 0) {
//                 setResult({
//                     data: [],
//                     error: null,
//                     loading: false,
//                 });
//                 return;
//             }

//             // 2. Get cover image URLs from storage
//             const magazinesWithImages = await Promise.all(
//                 magazines.map(async (magazine) => {
//                     if (magazine.cover_image_name) {
//                         const { data: { publicUrl } } = supabase
//                             .storage
//                             .from('shubh-chintak')
//                             .getPublicUrl(`magzine-cover/${magazine.cover_image_name}.png`);

//                         return {
//                             ...magazine,
//                             cover_image_url: publicUrl
//                         };
//                     }
//                     return magazine;
//                 })
//             );

//             setResult({
//                 data: magazinesWithImages,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     useEffect(() => {
//         fetchShubhChintak();
//     }, [limit]);

//     return { ...result, refetch: fetchShubhChintak };
// };




// interface Article {
//     id: string;
//     user_id: string;
//     title: string;
//     body: string;
//     image: string;
//     created_at: string;
//     userName: string;
// }


// export const useNews = () => {
//     const [result, setResult] = useState<UseQueryResult<Article[]>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchNews = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));
//             const { data: articles, error: articlesError } = await supabase
//                 .from('articles')
//                 .select('*');

//             if (articlesError) throw articlesError;

//             const articlesWithUserNames = await Promise.all(articles.map(async (article) => {
//                 const { data: userProfile, error: profileError } = await supabase
//                     .from('profiles')
//                     .select('name')
//                     .eq('id', article.user_id)
//                     .single();

//                 if (profileError) throw profileError;

//                 return {
//                     ...article,
//                     userName: userProfile.name
//                 };
//             }));

//             const articlesWithImages = await Promise.all(articlesWithUserNames.map(async (article) => {
//                 const { data: imageData } = await supabase
//                     .storage
//                     .from('articles')
//                     .getPublicUrl(article.user_id);


//                 return {
//                     ...article,
//                     image: imageData.publicUrl + ".jpg",
//                 };
//             }));

//             if (!articlesWithImages) throw new Error('No articles found')

//             setResult({
//                 data: articlesWithImages,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };


//     useEffect(() => {
//         fetchNews();
//     }, []);

//     return { ...result, refetch: fetchNews };
// }


// // Business Types
// type Business = {
//     id: string;
//     user_id: string;
//     name: string;
//     category: string;
//     description: string;
//     location: string;
//     contact_email: string;
//     contact_phone: string;
//     website: string;
//     created_at: string;
//     images?: string[];
//     logo?: string;
// };


// // Hooks for Business-related queries
// export const useBusiness = () => {
//     const [result, setResult] = useState<UseQueryResult<Business[]>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchBusinesses = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));
//             const { data, error } = await supabase
//                 .from('businesses')
//                 .select('*');

//             if (error) throw error;

//             // Fetch images and logo for each business
//             const businessesWithImages = await Promise.all(data.map(async (business) => {
//                 // Get business logo
//                 const { data: logoData } = await supabase
//                     .storage
//                     .from('businesses')
//                     .list(`${business.user_id}/logo`);

//                 const logoUrl = logoData && logoData.length > 0
//                     ? (await supabase.storage.from('businesses').getPublicUrl(`${business.user_id}/logo/${logoData[0].name}`)).data.publicUrl
//                     : null;

//                 // Get business images
//                 const { data: imagesData } = await supabase
//                     .storage
//                     .from('businesses')
//                     .list(`${business.user_id}/images`);

//                 const imageUrls = await Promise.all(
//                     (imagesData || []).map(async (image) => {
//                         const { data: { publicUrl } } = await supabase
//                             .storage
//                             .from('businesses')
//                             .getPublicUrl(`${business.user_id}/images/${image.name}`);
//                         return publicUrl;
//                     })
//                 );

//                 return {
//                     ...business,
//                     logo: logoUrl,
//                     images: imageUrls
//                 };
//             }));

//             setResult({
//                 data: businessesWithImages,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     useEffect(() => {
//         fetchBusinesses();
//     }, []);

//     return { ...result, refetch: fetchBusinesses };
// };

// export const useFamily = () => {
//     const [error, setError] = useState<string | null>(null);
//     const [result, setResult] = useState<FamilyData>({
//         family_no: '',
//         family_cover_pic: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1000',
//         surname: '',
//         address: '',
//         head_of_family: {
//             name: '',
//             profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
//             occupation: ''
//         },
//         familyMembers: []
//     });

//     const fetchFamily = async (email: string | undefined) => {
//         if (!email) return;

//         try {
//             const { data: userData, error: userError } = await supabase
//                 .from('profiles')
//                 .select('*')
//                 .eq('email', email)
//                 .single();

//             if (userError || !userData) {
//                 throw userError || new Error('User not found');
//             }

//             // Get all profiles with the same email domain (same family)
//             const emailParts = email.split('@');
//             const emailDomain = emailParts[1];

//             const { data: familyData, error: familyError } = await supabase
//                 .from('profiles')
//                 .select('*')
//                 .ilike('email', `%@${emailDomain}`);

//             if (familyError || !familyData) {
//                 throw familyError || new Error('Family data not found');
//             }

//             const headOfFamily = familyData.find(member => member.relationship?.toLowerCase() === 'self') || userData;
//             const address = [
//                 userData.residential_address_line1,
//                 userData.residential_address_city,
//                 userData.residential_address_state
//             ].filter(Boolean).join(', ');

//             // Get the family cover image URL from Supabase storage
//             const coverImagePath = userData.family_cover_pic;
//             const { data: coverImageUrl } = await supabase
//                 .storage
//                 .from('family-cover-images')
//                 .getPublicUrl(coverImagePath || '');

//             // Get profile picture URLs for head of family and all family members
//             const { data: headProfileUrl } = await supabase
//                 .storage
//                 .from('profile-pictures')
//                 .getPublicUrl(headOfFamily.profile_pic || '');

//             // Transform family data to include public URLs for profile pictures
//             const transformedFamilyData = await Promise.all(familyData.map(async (member) => {
//                 const { data: profileUrl } = await supabase
//                     .storage
//                     .from('profile-pictures')
//                     .getPublicUrl(member.profile_pic || '');
//                 return {
//                     ...member,
//                     profile_pic: profileUrl?.publicUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
//                 };
//             }));

//             setResult({
//                 family_no: userData.family_no,
//                 family_cover_pic: coverImageUrl?.publicUrl || 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1000',
//                 surname: userData.surname,
//                 address: address,
//                 head_of_family: {
//                     name: headOfFamily.name,
//                     profile_pic: headProfileUrl?.publicUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
//                     occupation: headOfFamily.occupation || 'Not specified'
//                 },
//                 familyMembers: transformedFamilyData
//             });
//         } catch (error) {
//             setResult({
//                 family_no: '',
//                 family_cover_pic: '',
//                 surname: '',
//                 address: '',
//                 head_of_family: null,
//                 familyMembers: []
//             });
//             setError(error);
//         }
//     };

//     useEffect(() => {
//         fetchFamily('');
//     }, []);

//     return { result, fetchFamily, error };
// };

// // Function to update phone, address, and date of birth
// export const updateProfileDetails = async (id: string, name: string, phone: string, address_line1: string, address_city: string, address_state: string, dateOfBirth: string) => {
//     try {
//         const { error } = await supabase
//             .from('profiles')
//             .update({
//                 name: name,
//                 mobile_no1: phone,
//                 residential_address_line1: address_line1,
//                 residential_address_city: address_city,
//                 residential_address_state: address_state,
//                 date_of_birth: dateOfBirth
//             })
//             .eq('id', id);

//         if (error) throw error;
//         return { success: true };
//     } catch (error) {
//         console.error('Error updating profile details:', error);
//         return { success: false, error };
//     }
// };

// // Function to upload cover image and update profile
// export const uploadCoverImage = async (userId: string, imageUri: string, bucket: string) => {
//     try {
//         // Generate a unique filename using userId and timestamp
//         const filename = `cover_${userId}_${Date.now()}`;

//         // Convert image to base64
//         const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });

//         // Get file extension from URI
//         const fileExtension = imageUri.split('.').pop();
//         const filePath = `${filename}.${fileExtension}`;
//         const contentType = `image/${fileExtension}`;

//         // Upload image to Supabase storage
//         const { data, error: uploadError } = await supabase
//             .storage
//             .from(bucket)
//             .upload(filePath, decode(base64), { contentType });

//         if (uploadError) throw uploadError;

//         if (bucket === 'profile-pictures') {
//             // Update the profile with the new image path (prev)
//             const { error: updateError } = await supabase
//                 .from('profiles')
//                 .update({ profile_pic: data.path })
//                 .eq('id', userId);

//             if (updateError) throw updateError;
//         } else {
//             const { error: updateError } = await supabase
//                 .from('profiles')
//                 .update({ family_cover_pic: data.path })
//                 .eq('id', userId);
//             if (updateError) throw updateError;
//         }


//         // Get public URL for the uploaded image
//         const { data: publicUrlData } = await supabase
//             .storage
//             .from(bucket)
//             .getPublicUrl(data.path);

//         return {
//             success: true,
//             path: data.path,
//             publicUrl: publicUrlData.publicUrl
//         };
//     } catch (error) {
//         console.error('Error uploading cover image:', error);
//         return { success: false, error };
//     }
// };


// export const useEvents = () => {
//     const [result, setResult] = useState<UseQueryResult<Event[]>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchEvents = async () => {
//         try {
//             setResult(prev => ({ ...prev, loading: true }));
//             const { data, error } = await supabase
//                 .from('events')
//                 .select('*')
//                 .order('event_date', { ascending: true });

//             if (error) throw error;

//             // Format the data for display
//             const formattedEvents = data.map(event => ({
//                 ...event,
//                 // Add a default image if none exists
//                 image: event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000'
//             }));

//             setResult({
//                 data: formattedEvents,
//                 error: null,
//                 loading: false,
//             });
//         } catch (error) {
//             setResult({
//                 data: null,
//                 error: error as Error,
//                 loading: false,
//             });
//         }
//     };

//     useEffect(() => {
//         fetchEvents();
//     }, []);

//     return { ...result, refetch: fetchEvents };
// };

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
                            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=300",
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
                            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=300",
                        coverImage:
                            headMember.family_cover_pic ||
                            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000",
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