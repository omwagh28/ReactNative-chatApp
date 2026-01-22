import { View, Text } from "react-native";

export default function ChatBubble({ message, isMe }) {
  return (
    <View
      style={{
        alignSelf: isMe ? "flex-end" : "flex-start",
        backgroundColor: isMe ? "#2563EB" : "#E5E7EB",
        padding: 10,
        borderRadius: 10,
        marginVertical: 6,
        maxWidth: "70%",
      }}
    >
      <Text style={{ color: isMe ? "#FFF" : "#000" }}>
        {message.text}
      </Text>
    </View>
  );
}
