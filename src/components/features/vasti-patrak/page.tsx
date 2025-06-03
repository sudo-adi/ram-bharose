import React, { useState, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, RefreshControl, Modal, Dimensions, Linking, StyleSheet } from "react-native";

const { height } = Dimensions.get('window');
import { useFamilies } from "../../../hooks/useSupabase";
import { handleCall, handleEmail, handleWhatsApp } from "../businessess/sub-componenets/contactUtils";

const FamilyDetailsModal = ({ visible, family, onClose }) => {
  if (!family) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Image
                source={{ uri: family.coverImage }}
                style={styles.modalCoverImage}
              />
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitle}>{family.name}</Text>
                <Text style={styles.modalSubtitle}>{family.totalMembers} family members</Text>
              </View>
            </View>

            <View style={styles.modalBody}>
              {family.address && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoText}>
                    {family.address}, {family.city}, {family.state}
                  </Text>
                </View>
              )}

              <Text style={styles.sectionTitle}>Family Members</Text>
              {family.members?.map((member) => (
                <View key={member.uuid} style={styles.memberCard}>
                  <Image
                    source={{ uri: member.profile_pic }}
                    style={styles.memberImage}
                  />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.name} {member.surname}
                    </Text>
                    {member.relationship && (
                      <Text style={styles.memberRelation}>{member.relationship}</Text>
                    )}
                    {member.occupation && (
                      <Text style={styles.memberDetail}>{member.occupation}</Text>
                    )}
                    {member.date_of_birth && (
                      <Text style={styles.memberDetail}>DOB: {member.date_of_birth}</Text>
                    )}
                    {member.blood_group && (
                      <Text style={styles.memberDetail}>Blood Group: {member.blood_group}</Text>
                    )}
                    {(member.education || member.qualification) && (
                      <Text style={styles.memberDetail}>
                        {[member.education, member.qualification].filter(Boolean).join(" - ")}
                      </Text>
                    )}
                  </View>
                  <View style={styles.memberActions}>
                    {member.mobile_no1 && (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.callButton]}
                          onPress={() => handleCall(member.mobile_no1)}
                        >
                          <Text style={styles.actionButtonText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.whatsappButton]}
                          onPress={() => handleWhatsApp(member.mobile_no1)}
                        >
                          <Text style={styles.actionButtonText}>WhatsApp</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {member.email && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.emailButton]}
                        onPress={() => handleEmail(member.email)}
                      >
                        <Text style={styles.actionButtonText}>Email</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const VastiPatrak = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: familiesData,
    loading: familiesLoading,
    error: familiesError,
    refetch: refetchFamilies,
  } = useFamilies(currentPage, pageSize, debouncedSearchQuery);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const handleFamilyPress = (family) => {
    setSelectedFamily(family);
    setModalVisible(true);
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (phoneNumber) => {
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    Linking.openURL(`https://wa.me/${formattedNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  if (familiesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading families...</Text>
      </View>
    );
  }

  if (familiesError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{familiesError?.message || "Error loading families"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetchFamilies}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const families = familiesData?.families || [];
  const totalFamilies = familiesData?.count || 0;
  const totalPages = Math.ceil(totalFamilies / pageSize);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={familiesLoading} onRefresh={refetchFamilies} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Families</Text>
          <Text style={styles.subtitle}>Explore our community families and their members</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search families..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {families.length > 0 ? (
        <View style={styles.familiesGrid}>
          {families.map((family) => (
            <TouchableOpacity
              key={family.id}
              style={styles.familyCard}
              onPress={() => handleFamilyPress(family)}
            >
              <Image
                source={{ uri: family.coverImage }}
                style={styles.familyCover}
              // defaultSource={require("../../../../assets/default-cover.png")}
              />
              <View style={styles.familyInfo}>
                <Text style={styles.familyName}>{family.name}</Text>
                <Text style={styles.familyHead}>{family.headName}</Text>
                <Text style={styles.memberCount}>{family.totalMembers} members</Text>
                {family.city && (
                  <Text style={styles.location}>{family.city}, {family.state}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {searchQuery ? "No families match your search" : "No families available"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? "Try using different keywords or clear your search"
              : "Check back later for family updates"}
          </Text>
        </View>
      )}
      {families.length > 0 && totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
            onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Text style={[styles.pageButtonText, currentPage === 1 && styles.pageButtonTextDisabled]}>Previous</Text>
          </TouchableOpacity>

          <View style={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const showPage = page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                if ((page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2)) {
                  return (
                    <Text key={`ellipsis-${page}`} style={styles.pageEllipsis}>...</Text>
                  );
                }
                return null;
              }

              return (
                <TouchableOpacity
                  key={page}
                  style={[styles.pageNumberButton, page === currentPage && styles.pageNumberButtonActive]}
                  onPress={() => setCurrentPage(page)}
                >
                  <Text
                    style={[styles.pageNumberText, page === currentPage && styles.pageNumberTextActive]}
                  >
                    {page}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.pageButton, currentPage >= totalPages && styles.pageButtonDisabled]}
            onPress={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <Text style={[styles.pageButtonText, currentPage >= totalPages && styles.pageButtonTextDisabled]}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      <FamilyDetailsModal
        visible={modalVisible}
        family={selectedFamily}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    minHeight: height * 0.5,
  },
  modalHeader: {
    position: 'relative',
  },
  modalCoverImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeaderContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  modalBody: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  memberCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  memberRelation: {
    fontSize: 14,
    color: '#f97316',
    marginTop: 2,
  },
  memberDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  memberActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  callButton: {
    backgroundColor: '#f97316',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  emailButton: {
    backgroundColor: '#3b82f6',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#f97316",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  familiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  familyCard: {
    width: "50%",
    padding: 8,
  },
  familyCover: {
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  familyInfo: {
    padding: 12,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  familyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  familyHead: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  memberCount: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
  },
  location: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  pageButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  pageButtonText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  pageButtonTextDisabled: {
    color: '#9ca3af',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  pageNumberButton: {
    minWidth: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  pageNumberButtonActive: {
    backgroundColor: '#f97316',
  },
  pageNumberText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  pageNumberTextActive: {
    color: '#ffffff',
  },
  pageEllipsis: {
    marginHorizontal: 4,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default VastiPatrak;