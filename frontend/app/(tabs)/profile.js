import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile, changePassword } from "../../services/api";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  const [name, setName] = useState(user.name);
  const [editingName, setEditingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordBox, setShowPasswordBox] = useState(false);

  const initial = user.name.charAt(0).toUpperCase();

  const saveName = async () => {
    if (!name.trim()) return;

    try {
      await updateProfile({ name });
      user.name = name;
      setEditingName(false);
      Alert.alert("Success", "Name updated");
    } catch {
      Alert.alert("Error", "Failed to update name");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      return Alert.alert("Error", "Fill all fields");
    }

    try {
      await changePassword({ currentPassword, newPassword });
      Alert.alert("Success", "Password changed. Please login again.");
      logout(); // 🔐 force logout
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Password change failed"
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB", padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 20 }}>
        Profile
      </Text>

      {/* PROFILE CARD */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 18,
          padding: 20,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: "#2563EB",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 36, fontWeight: "700" }}>
            {initial}
          </Text>
        </View>

        {editingName ? (
          <TextInput
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              padding: 10,
              width: "100%",
              textAlign: "center",
              fontSize: 18,
            }}
          />
        ) : (
          <Text style={{ fontSize: 20, fontWeight: "600" }}>{user.name}</Text>
        )}

        <Text style={{ color: "#6B7280", marginTop: 4 }}>
          {user.email}
        </Text>

        <Pressable
          onPress={editingName ? saveName : () => setEditingName(true)}
          style={{
            marginTop: 14,
            backgroundColor: "#2563EB",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {editingName ? "Save Name" : "Edit Name"}
          </Text>
        </Pressable>
      </View>

      {/* CHANGE PASSWORD */}
      <View
        style={{
          marginTop: 30,
          backgroundColor: "#fff",
          borderRadius: 18,
          padding: 20,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <Pressable onPress={() => setShowPasswordBox(!showPasswordBox)}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            Change Password
          </Text>
        </Pressable>

        {showPasswordBox && (
          <>
            <TextInput
              placeholder="Current password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={{
                borderWidth: 1,
                borderRadius: 12,
                padding: 10,
                marginTop: 12,
              }}
            />

            <TextInput
              placeholder="New password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={{
                borderWidth: 1,
                borderRadius: 12,
                padding: 10,
                marginTop: 12,
              }}
            />

            <Pressable
              onPress={handleChangePassword}
              style={{
                marginTop: 14,
                backgroundColor: "#16A34A",
                paddingVertical: 10,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Update Password
              </Text>
            </Pressable>
          </>
        )}
      </View>

      {/* LOGOUT */}
      <Pressable
        onPress={logout}
        style={{
          marginTop: 30,
          backgroundColor: "#EF4444",
          paddingVertical: 14,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
}
