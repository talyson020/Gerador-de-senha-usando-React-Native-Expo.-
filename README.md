Perfeito, Talyson 👌
Aqui está um modelo de descrição estilo README.md que você pode colocar direto no seu GitHub para o projeto:

Gerador TMP
Aplicativo desenvolvido em React Native com Expo, que integra autenticação via Google OAuth 2.0 e permite interação com o Google Drive.
🚀 Funcionalidades
- Login com conta Google (OAuth 2.0).
- Obtenção de dados do perfil do usuário (nome, email, foto).
- Upload de arquivos para o Google Drive.
- Escopos configurados: profile, email, https://www.googleapis.com/auth/drive.file.
🛠️ Tecnologias
- React Native
- Expo
- expo-auth-session (docs.expo.dev in Bing)
- Google Cloud Console (OAuth Client IDs)
📂 Estrutura
- useGoogleAuth.js → Hook responsável pela autenticação e retorno do token.
- GoogleDriveScreen.js → Tela com botão de login e upload de arquivo para o Drive.
🔑 Configuração
No Google Cloud Console, crie os Client IDs para cada plataforma:
- Android → 282609689927-m015gntqa1mk3h6lug94sf2qsp73ds98.apps.googleusercontent.com
- Expo Go → 282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com
- iOS → (criar com seu bundleIdentifier)
- Web → (criar com redirect URI https://auth.expo.io/@talyson020/gerador-tmp)
▶️ Como rodar
# Instalar dependências
npm install

# Rodar no Expo Go
npx expo start
![1](https://github.com/user-attachments/assets/c52965e2-0e40-4f54-9cd1-31e1999611d7)
![2](https://github.com/user-attachments/assets/fd65bcb7-5d03-4a58-8e58-916292235230)
![3](https://github.com/user-attachments/assets/26cd9ebd-3b1d-4fbc-8fa6-6a19321337a8)
![4](https://github.com/user-attachments/assets/42ce62b4-06cf-413b-953c-016faa9a25b6)
![5](https://github.com/user-attachments/assets/25ea62f7-4a1e-473b-863a-af0f9215740a)
![6](https://github.com/user-attachments/assets/ee2ee7bd-68d2-47a9-bf0b-81c90b3c94ad)






