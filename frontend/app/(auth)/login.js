import { View, TextInput, Pressable, Text } from "react-native";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login({ email, password });
      router.replace("/(tabs)/chats");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* CARD */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 24,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Login
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            padding: 14,
            borderRadius: 12,
            marginBottom: 14,
            backgroundColor: "#F9FAFB",
          }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            padding: 14,
            borderRadius: 12,
            marginBottom: 20,
            backgroundColor: "#F9FAFB",
          }}
        />

        <Pressable
          onPress={handleLogin}
          style={{
            backgroundColor: "#2563EB",
            paddingVertical: 14,
            borderRadius: 12,
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Login
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/signup")}>
          <Text style={{ textAlign: "center", color: "#2563EB" }}>
            Don’t have an account? Sign up
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
