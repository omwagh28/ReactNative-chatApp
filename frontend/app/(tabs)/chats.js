// frontend/app/(tabs)/chats.js

import { View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { getUsers, createChat } from "../../services/api";
import { useRouter } from "expo-router";

export default function Chats() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  const openChat = async (userId) => {
    try {
      const res = await createChat(userId);
      router.push(`/chat/${res.data._id}`);
    } catch (err) {
      alert("Failed to open chat");
    }
  };

  const renderUser = ({ item }) => {
    const initial = item.name?.charAt(0).toUpperCase();

    return (
      <Pressable
        onPress={() => openChat(item._id)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 14,
          marginBottom: 12,
          borderRadius: 14,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#2563EB",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            {initial}
          </Text>
        </View>

        {/* Name */}
        <View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: "#111827",
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#6B7280",
              marginTop: 2,
            }}
          >
            Tap to chat
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 16,
        paddingTop: 16,
      }}
    >
      {/* HEADER */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          marginBottom: 16,
          color: "#111827",
        }}
      >
        Chats
      </Text>

      {/* USER LIST */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
