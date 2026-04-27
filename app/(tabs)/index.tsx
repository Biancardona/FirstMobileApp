import { ImageBackground, StyleSheet, Text, View } from "react-native";

// Imagen de fondo
const BG_IMAGE = {
  uri: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
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
          {/* Nombre de la app */}
          <Text style={styles.appName}>FirstMobileApp</Text>

          {/* Línea decorativa */}
          <View style={styles.divider} />

          {/* Mensaje de bienvenida */}
          <Text style={styles.welcome}>¡Bienvenido!</Text>
          <Text style={styles.subtitle}>
            Tu catálogo de películas favoritas en un solo lugar. Descubre,
            explora y guarda tus títulos preferidos.
          </Text>

          {/* Row con íconos decorativos */}
          <View style={styles.row}>
            <Text style={styles.icon}>🎬</Text>
            <Text style={styles.icon}>🎥</Text>
            <Text style={styles.icon}>🍿</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // ImageBackground ocupa toda la pantalla
  background: {
    flex: 1,
  },

  // Overlay oscuro semitransparente sobre la imagen
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 30, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  // Column — contenedor principal centrado
  column: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },

  // Nombre de la app
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 12,
  },

  // Línea decorativa
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#6366f1",
    borderRadius: 2,
    marginBottom: 24,
  },

  // Texto de bienvenida
  welcome: {
    fontSize: 24,
    fontWeight: "600",
    color: "#e0e0ff",
    marginBottom: 12,
    textAlign: "center",
  },

  // Descripción
  subtitle: {
    fontSize: 15,
    color: "#b0b0cc",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },

  // Row — íconos decorativos en línea horizontal
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },

  icon: {
    fontSize: 36,
  },
});
