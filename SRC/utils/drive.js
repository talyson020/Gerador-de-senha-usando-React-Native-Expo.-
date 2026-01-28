import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com',
    iosClientId: '282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com',
    androidClientId: '282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com',
    webClientId: '282609689927-50qkbvrj2i9gu3gejvsf1iks32c3g0fc.apps.googleusercontent.com',
    scopes: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'],
    redirectUri: Google.makeRedirectUri({
      useProxy: true,   // 🔑 força usar https://auth.expo.io/@talyson020/gerador
    }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Token de acesso:', authentication.accessToken);
    }
  }, [response]);

  return { request, response, promptAsync };
}