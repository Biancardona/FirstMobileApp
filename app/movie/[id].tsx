import { getMovieById, MCUMovie } from "@/services/marvelService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<MCUMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMovieById(Number(id))
      .then(setMovie)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E62429" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Película no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.cover_url }} style={styles.poster} />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Fase {movie.phase}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{movie.saga}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{movie.duration} min</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Estreno:</Text>
          <Text style={styles.value}>
            {new Date(movie.release_date).toLocaleDateString("es-MX")}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Director:</Text>
          <Text style={styles.value}>{movie.directed_by}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Taquilla:</Text>
          <Text style={styles.value}>{movie.box_office}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Post-créditos:</Text>
          <Text style={styles.value}>{movie.post_credit_scenes} escena(s)</Text>
        </View>

        <Text style={styles.sectionTitle}>Sinopsis</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
  },
  poster: { width: "100%", height: 300, resizeMode: "cover" },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  backText: { color: "#fff", fontSize: 14 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 12 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  badge: {
    backgroundColor: "#E62429",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  infoRow: { flexDirection: "row", marginBottom: 8 },
  label: { color: "#E62429", fontWeight: "bold", width: 110, fontSize: 14 },
  value: { color: "#fff", flex: 1, fontSize: 14 },
  sectionTitle: {
    color: "#E62429",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },
  overview: { color: "#ccc", lineHeight: 22, fontSize: 14 },
});
