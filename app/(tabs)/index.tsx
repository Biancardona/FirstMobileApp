import { ImageBackground, StyleSheet, Text, View } from "react-native";

// Imagen de fondo
const BG_IMAGE = {
  uri: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80",
};

export default function HomeScreen() {
  return (
    // ImageBackground — equivalente a Container con imagen de fondo en Flutter
    <ImageBackground
      source={BG_IMAGE}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay oscuro sobre la imagen */}
      <View style={styles.overlay}>
        {/* Column principal — centra todo el contenido */}
        <View style={styles.column}>
          <Text style={styles.pokeball}>🔴</Text>

          {/* Nombre de la app */}
          <Text style={styles.appName}>FirstMobileApp</Text>

          {/* Línea decorativa */}
          <View style={styles.divider} />

          {/* Mensaje de bienvenida */}
          <Text style={styles.welcome}>¡Bienvenido Entrenador!</Text>
          <Text style={styles.subtitle}>
            Explora la Pokédex y descubre información sobre tus Pokémon
            favoritos. ¡Atrapa, aprende y conviértete en el mejor!
          </Text>

          {/* Row con íconos decorativos */}
          <View style={styles.row}>
            <Text style={styles.icon}>⚡</Text>
            <Text style={styles.icon}>🔴</Text>
            <Text style={styles.icon}>🌊</Text>
            <Text style={styles.icon}>🔥</Text>
            <Text style={styles.icon}>🌿</Text>
          </View>
          <Text style={styles.motto}>"¡Hazte con todos!"</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  // Overlay rojo oscuro temático Pokémon
  overlay: {
    flex: 1,
    backgroundColor: "rgba(180, 10, 10, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  column: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },

  // Pokéball grande decorativa
  pokeball: {
    fontSize: 72,
    marginBottom: 16,
  },

  appName: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  // Línea decorativa amarilla — color Pikachu
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginBottom: 24,
  },

  welcome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  subtitle: {
    fontSize: 15,
    color: "#ffe0e0",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },

  icon: {
    fontSize: 32,
  },

  motto: {
    fontSize: 16,
    color: "#FFD700",
    fontStyle: "italic",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 1,
  },
});
