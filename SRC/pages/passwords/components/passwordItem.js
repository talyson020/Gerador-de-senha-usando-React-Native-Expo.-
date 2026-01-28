import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

export function PasswordItem({ data, removePassword }) {
  
  async function copyToClipboard() {
    await Clipboard.setStringAsync(data.password);
    Alert.alert("Copiado!", "A senha foi copiada para a área de transferência.");
  }

  function handleLongPress() {
    Alert.alert(
      "Confirmação de exclusão",
      "Você tem certeza que deseja excluir esta senha?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "OK", onPress: () => removePassword() }
      ],
      { cancelable: false }
    );
  }

  return (
    <Pressable
      onPress={copyToClipboard}
      onLongPress={handleLongPress}
      style={styles.container}
    >
      <View>
        <Text style={styles.label}>{data.text}</Text>
        <Text style={styles.password}>{data.password}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0887e1",
    padding: 14,
    width: "100%",
    marginBottom: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 4,
  },
  password: {
    color: "#FFF",
    fontSize: 16,
  },
});