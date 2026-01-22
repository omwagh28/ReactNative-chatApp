import { Pressable, ActivityIndicator, Text } from "react-native";

export default function LoadingButton({ title, loading, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 12,
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
