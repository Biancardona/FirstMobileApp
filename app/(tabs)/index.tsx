import { getMovies, MCUMovie } from "@/services/marvelService";
import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Peliculas destacadas por ID (las más icónicas del MCU)
const FEATURED_IDS = [1, 3, 12, 14, 18, 23]; // Iron Man, Avengers, Infinity War, Endgame...

export default function HomeScreen() {
  const [movies, setMovies] = useState<MCUMovie[]>([]);
  const [filtered, setFiltered] = useState<MCUMovie[]>([]);
  const [featured, setFeatured] = useState<MCUMovie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data);
        setFiltered(data);
        // Selecciona las destacadas por ID
        setFeatured(data.filter((m) => FEATURED_IDS.includes(m.id)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    setFiltered(
      text.trim() === ""
        ? movies
        : movies.filter((m) =>
            m.title.toLowerCase().includes(text.toLowerCase()),
          ),
    );
  };

  // Tarjeta horizontal para recomendaciones
  const renderFeatured = ({ item }: { item: MCUMovie }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => router.push(`/movie/${item.id}` as Href)}
    >
      <Image source={{ uri: item.cover_url }} style={styles.featuredPoster} />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.featuredPhase}>Fase {item.phase}</Text>
      </View>
    </TouchableOpacity>
  );

  // Tarjeta vertical para el catálogo completo
  const renderMovie = ({ item }: { item: MCUMovie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/movie/${item.id}` as Href)}
    >
      <Image source={{ uri: item.cover_url }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.phase}>
          Fase {item.phase} · {item.saga}
        </Text>
        <Text style={styles.date}>
          {new Date(item.release_date).getFullYear()}
        </Text>
        <Text style={styles.overview} numberOfLines={2}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E62429" />
        <Text style={styles.loadingText}>Cargando universo Marvel...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      <FlatList
        data={search.trim() !== "" ? filtered : movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovie}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        // Todo el contenido superior va en el header del FlatList
        ListHeaderComponent={
          <>
            {/* ── Hero con imagen de fondo ── */}
            <ImageBackground
              source={{ uri: "https://i.imgur.com/1ZqJQjE.jpg" }}
              style={styles.hero}
              imageStyle={styles.heroImage}
            >
              {/* Capa oscura encima de la imagen */}
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>MARVEL</Text>
                <Text style={styles.heroSub}>Cinematic Universe</Text>
                <Text style={styles.heroDesc}>
                  Explora todas las películas del universo cinematográfico
                  Marvel
                </Text>
              </View>
            </ImageBackground>

            {/* ── Buscador ── */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.search}
                placeholder="🔍  Buscar película..."
                placeholderTextColor="#888"
                value={search}
                onChangeText={handleSearch}
              />
            </View>

            {/* ── Recomendaciones (solo si no hay búsqueda activa) ── */}
            {search.trim() === "" && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>⭐ Recomendadas</Text>
                <FlatList
                  data={featured}
                  keyExtractor={(item) => `featured-${item.id}`}
                  renderItem={renderFeatured}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
                />
              </View>
            )}

            {/* ── Título del catálogo ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {search.trim() !== ""
                  ? `Resultados para "${search}" (${filtered.length})`
                  : `🎬 Catálogo completo (${movies.length})`}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No se encontraron películas</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  loadingText: { color: "#aaa", marginTop: 12, fontSize: 14 },

  // ── Hero ──
  hero: {
    width: "100%",
    height: 260,
  },
  heroImage: {
    resizeMode: "cover",
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
    padding: 20,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#E62429",
    letterSpacing: 6,
  },
  heroSub: {
    fontSize: 16,
    color: "#fff",
    letterSpacing: 3,
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 13,
    color: "#ccc",
    lineHeight: 18,
  },

  // ── Buscador ──
  searchContainer: { paddingHorizontal: 12, paddingVertical: 10 },
  search: {
    backgroundColor: "#16213E",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E62429",
  },

  // ── Secciones ──
  section: { marginTop: 8, marginBottom: 4 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  // ── Tarjeta recomendadas (horizontal) ──
  featuredCard: {
    width: 140,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  featuredPoster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: 8,
  },
  featuredTitle: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  featuredPhase: { color: "#E62429", fontSize: 11, marginTop: 2 },

  // ── Tarjeta catálogo (vertical) ──
  card: {
    flexDirection: "row",
    backgroundColor: "#16213E",
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },
  poster: { width: 90, height: 130 },
  info: { flex: 1, padding: 10, justifyContent: "center" },
  title: { fontSize: 15, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  phase: { fontSize: 12, color: "#E62429", marginBottom: 2 },
  date: { fontSize: 12, color: "#aaa", marginBottom: 4 },
  overview: { fontSize: 12, color: "#ccc", lineHeight: 16 },

  // ── Empty state ──
  empty: { alignItems: "center", paddingTop: 40 },
  emptyText: { color: "#aaa", fontSize: 15 },
});
