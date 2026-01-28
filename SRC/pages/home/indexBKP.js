import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Modal, TextInput, Button, Alert, FlatList, ActivityIndicator
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Importações locais
import { uploadParaDrive, baixarDoDrive } from '../../utils/drive';
import { ModalPassword } from '../../components/modal';

let charset = "!@#$abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVXWYZ0123456789";

export function Home() {
  const navigation = useNavigation();
  const [size, setSize] = useState(10);
  const [text, setText] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordValue, setPasswordValue] = useState({});
  const [authenticated, setAuthenticated] = useState(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState('');
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // Configuração do login Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com",
    iosClientId: "282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com",
    webClientId: "282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@talyson020/gerador-tmp"
  });

  useEffect(() => {
    checkMasterPassword();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
      Alert.alert('Sucesso', 'Login realizado com o Google!');
    } else if (response?.type === 'error') {
      Alert.alert('Erro no Login', 'Verifique se o link de redirecionamento está no Google Cloud.');
      console.log(response.error);
    }
  }, [response]);

  const checkMasterPassword = async () => {
    const saved = await SecureStore.getItemAsync('masterPassword');
    if (!saved) setIsFirstAccess(true);
    else authenticate();
  };

  const saveMasterPassword = async () => {
    if (masterPasswordInput.length < 4) {
      Alert.alert('Senha muito curta', 'Use pelo menos 4 caracteres.');
      return;
    }
    await SecureStore.setItemAsync('masterPassword', masterPasswordInput);
    setMasterPasswordInput('');
    setIsFirstAccess(false);
    authenticate();
  };

  const validateMasterPassword = async () => {
    const saved = await SecureStore.getItemAsync('masterPassword');
    if (masterPasswordInput === saved) {
      setAuthenticated(true);
      setMasterPasswordInput('');
    } else {
      Alert.alert('Senha incorreta', 'Tente novamente.');
      setMasterPasswordInput('');
    }
  };

  const authenticate = async () => {
    if (Platform.OS === 'web') {
      setIsFirstAccess(false);
      return;
    }
    const level = await LocalAuthentication.getEnrolledLevelAsync();
    if (level > 0) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para acessar',
        fallbackLabel: 'Usar senha mestre',
      });
      if (result.success) setAuthenticated(true);
    } else {
      setIsFirstAccess(false);
    }
  };

  const generatePassword = () => {
    let password = '';
    for (let i = 0; i < size; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    const nova = {
      id: Date.now().toString(),
      text: text || 'Sem nome',
      password,
    };
    setPasswords((prev) => [...prev, nova]);
    setPasswordValue(nova);
    setText('');
    setModalVisible(true);
  };

  const fazerBackup = async () => {
    if (!accessToken) return Alert.alert('Erro', 'Faça login com Google primeiro.');
    setLoading(true);
    try {
      await uploadParaDrive(accessToken, passwords);
      Alert.alert('Backup', 'Senhas salvas no Google Drive!');
    } catch (err) {
      Alert.alert('Erro', 'Falha ao fazer backup.');
    } finally {
      setLoading(false);
    }
  };

  const restaurarBackup = async () => {
    if (!accessToken) return Alert.alert('Erro', 'Faça login com Google primeiro.');
    setLoading(true);
    try {
      const restauradas = await baixarDoDrive(accessToken);
      if (restauradas) setPasswords(restauradas);
      Alert.alert('Restaurado', 'Senhas recuperadas do Google Drive!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível restaurar.');
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <View style={styles.container}>
        <Image source={require('../../assets/logo2.png')} style={{ marginBottom: 20 }} />
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          {isFirstAccess ? "Crie sua senha mestre:" : "Digite sua senha mestre:"}
        </Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={masterPasswordInput}
          onChangeText={setMasterPasswordInput}
          placeholder="Senha"
          placeholderTextColor="#DDD"
        />
        <Button
          title={isFirstAccess ? "Cadastrar" : "Entrar"}
          onPress={isFirstAccess ? saveMasterPassword : validateMasterPassword}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>{size} Caracteres</Text>

      <Slider
        style={{ width: '80%', height: 40 }}
        minimumValue={6}
        maximumValue={30}
        value={size}
        onValueChange={(v) => setSize(Number(v.toFixed(0)))}
      />

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Senha para..."
        placeholderTextColor="#DDD"
      />

      <TouchableOpacity style={styles.button} onPress={generatePassword}>
        <Text style={styles.buttonText}>Gerar Senha</Text>
      </TouchableOpacity>

      {/* Modal único */}
      <Modal visible={modalVisible} animationType='fade' transparent={true}>
        <ModalPassword password={passwordValue} handleClose={() => setModalVisible(false)} />
      </Modal>

      <View style={{ marginVertical: 10, width: '80%' }}>
        <Button
          title={accessToken ? "✅ Conectado ao Google" : "Login com Google"}
          disabled={!!accessToken}
          onPress={() => promptAsync()}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0887e1" />
      ) : (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <Button title="Backup ☁️" onPress={fazerBackup} disabled={!accessToken} />
          <Button title="Restaurar ⬇️" onPress={restaurarBackup} disabled={!accessToken} />
        </View>
      )}

      <FlatList
        style={{ width: '90%', marginTop: 20 }}
        data={passwords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#FFF', padding: 10, marginVertical: 5, borderRadius: 5, elevation: 2 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.text}</Text>
            <Text selectable>{item.password}</Text>
          </View>
        )}
      />

      {/* Botão para navegar até tela de senhas salvas */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Passwords')}>
        <Text style={styles.buttonText}>Ir para Minhas Senhas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F0F5', paddingTop: 50 },
  logo: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    backgroundColor: '#0887e1',
    width: '80%',
    height: 50,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 15,
    color: '#FFF',
    fontSize: 16
  },
  button: {
    backgroundColor: '#0887e1',
    width: '80%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});