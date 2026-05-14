import { useAuth } from "@/context/AuthContext";
import {
  addFavorite,
  getReview,
  isFavorite,
  removeFavorite,
  Review,
  saveReview,
} from "@/services/firebaseService";
import { getMovieById, MCUMovie } from "@/services/marvelService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [movie, setMovie] = useState<MCUMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const movieId = Number(id);
    getMovieById(movieId)
      .then(setMovie)
      .finally(() => setLoading(false));

    if (user) {
      isFavorite(user.uid, movieId).then(setFavorite);
      getReview(user.uid, movieId).then((r) => {
        if (r) {
          setReview(r);
          setRating(r.rating);
          setComment(r.comment);
        }
      });
    }
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!movie) return;
    if (favorite) {
      await removeFavorite(user.uid, movie.id);
    } else {
      await addFavorite(user.uid, {
        movieId: movie.id,
        title: movie.title,
        cover_url: movie.cover_url,
      });
    }
    setFavorite(!favorite);
  };

  const handleSaveReview = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!movie || rating === 0) {
      Alert.alert(
        "Calificación requerida",
        "Selecciona al menos una estrella.",
      );
      return;
    }
    setSaving(true);
    try {
      await saveReview(user.uid, {
        movieId: movie.id,
        title: movie.title,
        rating,
        comment,
      });
      Alert.alert("✅ Guardado", "Tu reseña fue guardada correctamente.");
    } catch {
      Alert.alert("Error", "No se pudo guardar la reseña.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E62429" />
      </View>
    );

  if (!movie)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Película no encontrada</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: movie.backdrop_url || movie.cover_url }}
        style={styles.backdrop}
      />

      {/* Botón volver */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      {/* Botón favorito */}
      <TouchableOpacity style={styles.favBtn} onPress={toggleFavorite}>
        <Text style={styles.favIcon}>{favorite ? "❤️" : "🤍"}</Text>
      </TouchableOpacity>

      {/* Info principal */}
      <View style={styles.header}>
        <Image source={{ uri: movie.cover_url }} style={styles.poster} />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.score}>
            ⭐ {movie.vote_average.toFixed(1)} / 10
          </Text>
          <Text style={styles.votes}>
            {movie.vote_count.toLocaleString()} votos
          </Text>
          <Text style={styles.date}>
            {movie.release_date
              ? new Date(movie.release_date).toLocaleDateString("es-MX")
              : "—"}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Sinopsis */}
        <Text style={styles.sectionTitle}>Sinopsis</Text>
        <Text style={styles.overview}>
          {movie.overview || "Sin sinopsis disponible."}
        </Text>

        {/* Sección reseña */}
        <Text style={styles.sectionTitle}>Tu reseña</Text>

        {!user && (
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginPrompt}>
              Inicia sesión para dejar una reseña →
            </Text>
          </TouchableOpacity>
        )}

        {user && (
          <>
            {/* Estrellas */}
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={styles.star}>{star <= rating ? "⭐" : "☆"}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Comentario */}
            <TextInput
              style={styles.commentInput}
              placeholder="Escribe tu reseña..."
              placeholderTextColor="#666"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
            />

            {/* Guardar */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveReview}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {review ? "Actualizar reseña" : "Guardar reseña"}
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
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
  backdrop: { width: "100%", height: 220, resizeMode: "cover" },
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
  favBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
  favIcon: { fontSize: 22 },
  header: { flexDirection: "row", padding: 16, marginTop: -40 },
  poster: { width: 100, height: 150, borderRadius: 10, elevation: 8 },
  headerInfo: { flex: 1, paddingLeft: 12, justifyContent: "flex-end" },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 6 },
  score: { fontSize: 15, color: "#FFD700", marginBottom: 2 },
  votes: { fontSize: 12, color: "#aaa", marginBottom: 4 },
  date: { fontSize: 12, color: "#aaa" },
  content: { padding: 16 },
  sectionTitle: {
    color: "#E62429",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  overview: { color: "#ccc", lineHeight: 22, fontSize: 14 },
  loginPrompt: {
    color: "#E62429",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  stars: { flexDirection: "row", gap: 8, marginBottom: 12 },
  star: { fontSize: 28 },
  commentInput: {
    backgroundColor: "#16213E",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
    textAlignVertical: "top",
    minHeight: 100,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#E62429",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
