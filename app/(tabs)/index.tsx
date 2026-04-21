import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scrollView}>
      {/* CONTAINER — equivalente a Container de Flutter */}
      <View style={styles.container}>
        <Text style={styles.titulo}>🎬 Catálogo de Películas</Text>
      </View>

      {/* COLUMN — equivalente a Column de Flutter (flexDirection: 'column') */}
      <View style={styles.column}>
        <Text style={styles.sectionTitle}>Column (elementos apilados)</Text>
        <Text style={styles.item}>🎥 Inception</Text>
        <Text style={styles.item}>🎥 Titanic</Text>
        <Text style={styles.item}>🎥 The Matrix</Text>
      </View>

      {/* ROW — equivalente a Row de Flutter (flexDirection: 'row') */}
      <View style={styles.row}>
        <Text style={styles.badge}>2010</Text>
        <Text style={styles.movieTitle}>Inception</Text>
        <Text style={styles.badge}>⭐ 8.8</Text>
      </View>

      {/* STACK — equivalente a Stack de Flutter (posición absoluta) */}
      <View style={styles.stack}>
        {/* Capa base */}
        <View style={styles.stackBase} />
        {/* Capa encima */}
        <Text style={styles.stackText}>Stack: texto sobre fondo</Text>
      </View>

      {/* TEXT con variantes */}
      <View style={styles.textSection}>
        <Text style={styles.textH1}>Título H1</Text>
        <Text style={styles.textH2}>Subtítulo H2</Text>
        <Text style={styles.textBody}>
          Texto de cuerpo: Una historia épica que demuestra el uso del widget
          Text con distintos estilos.
        </Text>
        <Text style={styles.textCaption}>Caption / texto pequeño</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // SCROLL
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // CONTAINER
  container: {
    backgroundColor: "#1a1a2e",
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  titulo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  // COLUMN
  column: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 16,
    margin: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  item: {
    fontSize: 16,
    paddingVertical: 4,
    color: "#333",
  },

  // ROW
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    margin: 12,
    borderRadius: 8,
    elevation: 3,
  },
  badge: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a2e",
  },

  // STACK
  stack: {
    position: "relative",
    height: 100,
    margin: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  stackBase: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1a1a2e",
  },
  stackText: {
    position: "absolute",
    bottom: 12,
    left: 12,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // TEXT
  textSection: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 12,
    borderRadius: 8,
    elevation: 3,
  },
  textH1: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  textH2: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textBody: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 8,
  },
  textCaption: {
    fontSize: 12,
    color: "#999",
  },
});
