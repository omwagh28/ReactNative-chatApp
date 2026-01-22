// frontend/app/chat/[id].js

import {
  View,
  FlatList,
  TextInput,
  Pressable,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useEffect, useState, useContext, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getMessages,
  sendMessage,
  markMessagesSeen,
  editMessage,
  deleteMessageForEveryone,
} from "../../services/api";
import API from "../../services/api";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { socket } from "../../services/socket";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();

  const flatListRef = useRef(null);

  /* =========================
     INITIAL LOAD + SOCKET
  ========================== */
  useEffect(() => {
    loadReceiver();
    loadMessages();

    socket.emit("joinChat", id);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socket.on("messagesSeen", () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.sender?._id === user._id ? { ...m, status: "seen" } : m
        )
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("messagesSeen");
    };
  }, []);

  /* =========================
     LOAD RECEIVER (HEADER)
     🔴 THIS IS THE FIX
  ========================== */
  const loadReceiver = async () => {
    try {
      const res = await API.get(`/chats/${id}`);
      setReceiver(res.data.receiver);
    } catch (err) {
      console.log("CHAT LOAD ERROR:", err.message);
    }
  };

  /* =========================
     LOAD MESSAGES
  ========================== */
  const loadMessages = async () => {
    const res = await getMessages(id);
    setMessages(res.data);

    await markMessagesSeen(id);
    socket.emit("seenMessages", {
      conversationId: id,
      userId: user._id,
    });

    scrollToBottom();
  };

  /* =========================
     SEND MESSAGE
  ========================== */
  const handleSend = async () => {
    if (!text.trim()) return;

    const res = await sendMessage({
      conversationId: id,
      text,
    });

    socket.emit("sendMessage", res.data);
    setMessages((prev) => [...prev, res.data]);
    setText("");
    scrollToBottom();
  };

  /* =========================
     SCROLL HELPER
  ========================== */
  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  /* =========================
     EDIT / DELETE MENU
  ========================== */
  const openActions = (item) => {
    Alert.alert("Message options", "", [
      {
        text: "Edit",
        onPress: () => {
          Alert.prompt("Edit message", "", async (newText) => {
            if (!newText) return;

            const res = await editMessage(item._id, newText);
            setMessages((prev) =>
              prev.map((m) => (m._id === item._id ? res.data : m))
            );
          });
        },
      },
      {
        text: "Delete for everyone",
        style: "destructive",
        onPress: async () => {
          await deleteMessageForEveryone(item._id);
          setMessages((prev) =>
            prev.map((m) =>
              m._id === item._id
                ? { ...m, isDeleted: true, text: "" }
                : m
            )
          );
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 14,
            borderBottomWidth: 1,
            borderColor: "#E5E7EB",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} />
          </Pressable>

          <Text style={{ marginLeft: 12, fontSize: 18, fontWeight: "600" }}>
            {receiver ? receiver.name : "Loading..."}
          </Text>
        </View>

        {/* MESSAGES */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => {
            const senderId =
              typeof item.sender === "string"
                ? item.sender
                : item.sender?._id;

            const isMe = senderId === user._id;

            return (
              <Pressable
                onLongPress={() => {
                  if (isMe && !item.isDeleted) openActions(item);
                }}
              >
                <View
                  style={{
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    backgroundColor: isMe ? "#2563EB" : "#E5E7EB",
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 16,
                    marginBottom: 8,
                    maxWidth: "75%",
                  }}
                >
                  <Text
                    style={{
                      color: item.isDeleted
                        ? "#9CA3AF"
                        : isMe
                        ? "#FFFFFF"
                        : "#111827",
                      fontStyle: item.isDeleted ? "italic" : "normal",
                    }}
                  >
                    {item.isDeleted
                      ? "This message was deleted"
                      : item.text}
                  </Text>

                  {!item.isDeleted && isMe && (
                    <Text
                      style={{
                        fontSize: 10,
                        marginTop: 2,
                        alignSelf: "flex-end",
                        color: "#E5E7EB",
                      }}
                    >
                      {item.isEdited && "edited "}
                      {item.status === "seen" ? "✔✔" : "✔"}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          }}
        />

        {/* INPUT */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 6,
            paddingBottom: insets.bottom,
            borderTopWidth: 1,
            borderColor: "#E5E7EB",
            backgroundColor: "#FFFFFF",
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            style={{
              flex: 1,
              backgroundColor: "#F3F4F6",
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          />

          <Pressable
            onPress={handleSend}
            style={{
              marginLeft: 8,
              backgroundColor: "#2563EB",
              width: 38,
              height: 38,
              borderRadius: 19,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
