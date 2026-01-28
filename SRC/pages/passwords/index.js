import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import useStorage from '../../hooks/useStorage';
import { PasswordItem } from './components/passwordItem';
import * as LocalAuthentication from 'expo-local-authentication';

export function Passwords() {
  const [listPasswords, setListPasswords] = useState([]);
  const focused = useIsFocused();
  const { getItem, removeItem } = useStorage();

  useEffect(() => {
    async function loadPasswords() {
      const passwords = await getItem("@pass");
      setListPasswords(passwords || []); // garante que seja sempre array
    }
    loadPasswords();
  }, [focused]);

  async function handleDeletePassword(item) {
    const passwords = await removeItem("@pass", item);
    setListPasswords(passwords || []);
    Alert.alert("Removido", "Senha apagada com sucesso!");
  }

  // Função para apagar todas com dupla confirmação + biometria
  async function handleDeleteAll() {
    Alert.alert(
      "Confirmar exclusão",
      "Você tem certeza que deseja apagar todas as senhas?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Continuar",
          style: "default",
          onPress: async () => {
            Alert.alert(
              "Confirmação final",
              "Essa ação é irreversível. Deseja prosseguir?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Apagar Tudo",
                  style: "destructive",
                  onPress: async () => {
                    const hasHardware = await LocalAuthentication.hasHardwareAsync();
                    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

                    if (hasHardware && isEnrolled) {
                      const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: "Autentique-se para apagar todas as senhas",
                        fallbackLabel: "Usar senha mestre"
                      });

                      if (result.success) {
                        const passwords = await removeItem("@pass"); // remove todas
                        setListPasswords(passwords || []);
                        Alert.alert("Removido", "Todas as senhas foram apagadas com sucesso!");
                      } else {
                        Alert.alert("Falha", "Autenticação não realizada. Nada foi apagado.");
                      }
                    } else {
                      Alert.alert("Erro", "Nenhuma biometria configurada no dispositivo.");
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Senhas:</Text>
        <Text style={styles.title}>| 1 clique para copiar |</Text>
        <Text style={styles.title}>| Pressione para apagar |</Text>
      </View>

      <View style={styles.content}>
        {listPasswords.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
            Nenhuma senha salva ainda.
          </Text>
        ) : (
          <>
            {/* Botão vermelho para apagar todas */}
            <TouchableOpacity 
              style={styles.buttonDeleteAll} 
              onPress={handleDeleteAll}
            >
              <Text style={styles.buttonDeleteAllText}>Apagar Todas</Text>
            </TouchableOpacity>

            <FlatList
              style={{ flex: 1, paddingTop: 14 }}
              data={listPasswords}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PasswordItem
                  data={item}
                  removePassword={() => handleDeletePassword(item)}
                />
              )}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0887e1",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
  },
  buttonDeleteAll: {
    backgroundColor: '#e53935', // vermelho para destacar
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonDeleteAllText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});