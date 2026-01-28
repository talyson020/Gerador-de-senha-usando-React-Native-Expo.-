import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();


export function useGoogleAuth() {
  const { authentication } = response;
const accessToken = authentication.accessToken;
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Este Client ID deve ser do tipo 'Aplicativo da Web' no Google Cloud Console
    // e ter o URI de redirecionamento do Expo Go configurado.
    expoClientId: '282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com',

    // Para iOS nativo, você precisaria de um Client ID tipo 'iOS'
    // Se você não for buildar para iOS nativo, pode removê-lo ou manter para referência futura.
    iosClientId: '282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com',

    // Para Android nativo, você precisaria de um Client ID tipo 'Android'
    // Se você não for buildar para Android nativo, pode removê-lo ou manter para referência futura.
    androidClientId: '282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com',

    // Este Client ID também deve ser do tipo 'Aplicativo da Web'.
    // Geralmente é o mesmo que o expoClientId para usos como o Expo Go.
    webClientId: '282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com',

    scopes: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Token de acesso:', authentication.accessToken);

      // Exemplo: buscar dados do perfil do usuário
      fetch('https://www.googleapis.com/userinfo/v2/me', {
  headers: { Authorization: `Bearer ${authentication.accessToken}` }
})
  .then(res => res.json())
  .then(data => console.log('Usuário logado:', data));




      // Aqui você pode passar o token para o drive.js
    }
  }, [response]);

  return {
    request,
    response,
    promptAsync,
  };
}
