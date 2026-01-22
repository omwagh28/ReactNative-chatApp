import { Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function ConversationItem({ chat }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/chat/${chat.id}`)}
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
      }}
    >
      <Text style={{ fontWeight: "600", fontSize: 16 }}>{chat.name}</Text>
      <Text style={{ color: "#6B7280", marginTop: 4 }}>
        {chat.lastMessage}
      </Text>
    </Pressable>
  );
}
