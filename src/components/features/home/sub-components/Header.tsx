import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import React from "react";
import { useMemberCounts } from "@/hooks/useProfiles";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: number;
  Title: string;
  Description: string;
  created_at: string;
};

type HeaderProps = {
  userName: string;
  getGreeting: () => string;
};

const { height } = Dimensions.get("window");

type NotificationDetailsModalProps = {
  visible: boolean;
  notification: Notification | null;
  onClose: () => void;
};

type NotificationsModalProps = {
  visible: boolean;
  notifications: Notification[];
  onClose: () => void;
  onNotificationPress: (notification: Notification) => void;
  onRefresh: () => void;
};

const NotificationDetailsModal = ({
  visible,
  notification,
  onClose,
}: NotificationDetailsModalProps) => {
  if (!notification) return null;

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
        <View style={[styles.modalContent, { height: height * 0.75 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{notification.Title}</Text>
            <Text style={styles.modalDate}>
              {new Date(notification.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.modalDescription}>
            {notification.Description}
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const NotificationsModal = ({
  visible,
  notifications,
  onClose,
  onNotificationPress,
  onRefresh,
}: NotificationsModalProps) => {
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
        <View style={[styles.modalContent, { height: height * 0.75 }]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={onRefresh}
              >
                <Ionicons name="refresh-outline" size={20} color="#4b5563" />
              </TouchableOpacity>
            </View>
          </View>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.notificationItem}
                onPress={() => onNotificationPress(notification)}
              >
                <Text style={styles.notificationTitle}>
                  {notification.Title}
                </Text>
                <Text style={styles.notificationDate}>
                  {new Date(notification.created_at).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#9ca3af"
              />
              <Text style={styles.emptyStateText}>No notifications yet</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const Header = ({ userName, getGreeting }: HeaderProps) => {
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { data: memberCounts, loading } = useMemberCounts();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("Notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setNotifications(data);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotifications(false);
  };

  // Toggle function with animation
  const toggleStats = () => {
    // Animate rotation
    Animated.timing(rotateAnim, {
      toValue: showDetailedStats ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Toggle state
    setShowDetailedStats(!showDetailedStats);
  };

  // Create interpolated rotation value
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View
      className="pt-8 pb-4 px-5 rounded-b-3xl shadow-lg"
      style={{
        backgroundColor: "#ff8c37",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1">
          <Text className="text-white text-xs opacity-90">
            {getGreeting()} ☀️
          </Text>
          <Text className="text-xl font-bold text-white">
            Namaste, {userName}
          </Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity
            className="mr-3"
            onPress={() => setShowNotifications(true)}
          >
            <View className="relative">
              <Ionicons name="notifications-outline" size={24} color="white" />
              {notifications.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-xs">
                    {notifications.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1">
            <Text className="text-white text-xs mr-2">
              {loading ? "..." : formatNumber(memberCounts.total)}
            </Text>
            <Ionicons name="people-outline" size={16} color="white" />
            <TouchableOpacity
              className="ml-2"
              onPress={toggleStats}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Ionicons name="chevron-down" size={16} color="white" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Wide Search Bar */}
      {/* <View className="flex-row items-center mb-4">
        <View className="flex-1 bg-white/20 rounded-full flex-row items-center px-3 py-2">
          <Ionicons name="search-outline" size={18} color="white" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            className="flex-1 ml-2 text-white"
          />
        </View>
      </View> */}

      {/* Expandable Detailed Community Stats */}
      {showDetailedStats && (
        <View className="flex-row justify-between bg-white/15 p-3 rounded-2xl">
          <View className="items-center">
            <Text className="text-lg font-bold text-white">
              {loading ? "..." : formatNumber(memberCounts.total)}
            </Text>
            <Text className="text-white text-xs">Total Members</Text>
          </View>
          <View className="h-full w-px bg-white/20" />
          <View className="items-center">
            <Text className="text-lg font-bold text-white">
              {loading ? "..." : formatNumber(memberCounts.male)}
            </Text>
            <Text className="text-white text-xs">Males</Text>
          </View>
          <View className="h-full w-px bg-white/20" />
          <View className="items-center">
            <Text className="text-lg font-bold text-white">
              {loading ? "..." : formatNumber(memberCounts.female)}
            </Text>
            <Text className="text-white text-xs">Females</Text>
          </View>
        </View>
      )}

      <NotificationsModal
        visible={showNotifications}
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
        onNotificationPress={handleNotificationPress}
        onRefresh={fetchNotifications}
      />

      <NotificationDetailsModal
        visible={!!selectedNotification}
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </View>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  modalDate: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  modalDescription: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
  },
  notificationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  notificationTitle: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
};

export default Header;
