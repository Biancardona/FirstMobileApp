import { getMovies, MCUMovie } from "@/services/marvelService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [movies, setMovies] = useState<MCUMovie[]>([]);
  const [filtered, setFiltered] = useState<MCUMovie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    setFiltered(
      movies.filter((m) => m.title.toLowerCase().includes(text.toLowerCase())),
    );
  };

  const renderMovie = ({ item }: { item: MCUMovie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/movie/${item.id}`)}
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
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Marvel Movies</Text>
        <Text style={styles.headerSub}>{filtered.length} películas</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar película..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovie}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
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
  header: { padding: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#E62429" },
  headerSub: { fontSize: 13, color: "#aaa", marginTop: 2 },
  search: {
    margin: 12,
    backgroundColor: "#16213E",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E62429",
  },
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
  title: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  phase: { fontSize: 12, color: "#E62429", marginBottom: 2 },
  date: { fontSize: 12, color: "#aaa", marginBottom: 4 },
  overview: { fontSize: 12, color: "#ccc", lineHeight: 16 },
});
