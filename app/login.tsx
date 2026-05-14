import { useAuth } from "@/context/AuthContext";
import { auth } from "@/services/firebaseService";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Estos IDs los encuentras en Google Cloud Console → Credenciales
    iosClientId: "TU_IOS_CLIENT_ID",
    androidClientId: "TU_ANDROID_CLIENT_ID",
    webClientId: "TU_WEB_CLIENT_ID",
  });

  // Si ya hay sesión, redirige al home
  useEffect(() => {
    if (user) router.replace("/(tabs)");
  }, [user]);

  // Maneja la respuesta de Google
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(console.error);
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>MARVEL</Text>
        <Text style={styles.sub}>Cinematic Universe</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.welcome}>Bienvenido</Text>
        <Text style={styles.desc}>
          Inicia sesión para guardar favoritos y escribir reseñas
        </Text>

        <TouchableOpacity
          style={[styles.googleBtn, !request && styles.disabled]}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Text style={styles.googleText}>🔑 Iniciar sesión con Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    justifyContent: "space-between",
  },
  hero: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#E62429",
    letterSpacing: 8,
  },
  sub: { fontSize: 16, color: "#fff", letterSpacing: 4, marginTop: 8 },
  card: {
    backgroundColor: "#16213E",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 32,
  },
  welcome: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  desc: { fontSize: 14, color: "#aaa", lineHeight: 20, marginBottom: 24 },
  googleBtn: {
    backgroundColor: "#E62429",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  googleText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  disabled: { opacity: 0.5 },
});
