import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Tipos de datos
interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  height: number;
  weight: number;
}

// Colores por tipo de Pokémon
const TYPE_COLORS: Record<string, string> = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
};

export default function PokemonScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0); // para paginación

  // Función que hace la petición HTTP a PokéAPI
  const fetchPokemons = async (offset = 0) => {
    try {
      setLoading(true);
      setError("");

      // Petición 1 — obtiene la lista de pokémons (20 por página)
      const listRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
      );
      const listData = await listRes.json();

      // Petición 2 — por cada Pokémon obtiene sus detalles
      const details = await Promise.all(
        listData.results.map(async (p: { url: string }) => {
          const detailRes = await fetch(p.url);
          const detail = await detailRes.json();

          return {
            id: detail.id,
            name: detail.name,
            sprite: detail.sprites.front_default,
            types: detail.types.map(
              (t: { type: { name: string } }) => t.type.name,
            ),
            height: detail.height,
            weight: detail.weight,
          } as Pokemon;
        }),
      );

      // Si es la primera página reemplaza, si no agrega
      if (offset === 0) {
        setPokemons(details);
      } else {
        setPokemons((prev) => [...prev, ...details]);
      }
    } catch (err) {
      setError("Error al conectar con PokéAPI. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial al montar el componente
  useEffect(() => {
    fetchPokemons(0);
  }, []);

  // Carga más pokémons al llegar al final de la lista
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPokemons(nextPage * 20);
  };

  // Tarjeta individual de Pokémon
  const PokemonCard = ({ item }: { item: Pokemon }) => {
    const mainType = item.types[0];
    const cardColor = TYPE_COLORS[mainType] ?? "#A8A878";

    return (
      <View
        style={[
          styles.card,
          { borderLeftColor: cardColor, borderLeftWidth: 5 },
        ]}
      >
        {/* Row — imagen + info */}
        <View style={styles.cardRow}>
          {/* Imagen del Pokémon */}
          <Image
            source={{ uri: item.sprite }}
            style={styles.sprite}
            resizeMode="contain"
          />

          {/* Column — datos del Pokémon */}
          <View style={styles.cardInfo}>
            {/* Número y nombre */}
            <Text style={styles.pokemonId}>
              #{String(item.id).padStart(3, "0")}
            </Text>
            <Text style={styles.pokemonName}>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Text>

            {/* Row — tipos */}
            <View style={styles.typesRow}>
              {item.types.map((type) => (
                <View
                  key={type}
                  style={[
                    styles.typeBadge,
                    { backgroundColor: TYPE_COLORS[type] ?? "#aaa" },
                  ]}
                >
                  <Text style={styles.typeText}>{type}</Text>
                </View>
              ))}
            </View>

            {/* Row — altura y peso */}
            <View style={styles.statsRow}>
              <Text style={styles.stat}>📏 {item.height / 10}m</Text>
              <Text style={styles.stat}>⚖️ {item.weight / 10}kg</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokédex</Text>
        <Text style={styles.headerSub}>Datos obtenidos de PokéAPI</Text>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => fetchPokemons(0)}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Lista de Pokémons */}
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PokemonCard item={item} />}
        contentContainerStyle={styles.list}
        onEndReached={loadMore} // carga más al llegar al final
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#EE1515"
              style={{ marginVertical: 20 }}
            />
          ) : (
            <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore}>
              <Text style={styles.loadMoreText}>Cargar más Pokémon</Text>
            </TouchableOpacity>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },

  // Header
  header: {
    backgroundColor: "#EE1515",
    padding: 16,
    paddingTop: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },

  // Lista
  list: {
    padding: 12,
    gap: 10,
  },

  // Tarjeta
  card: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  sprite: {
    width: 90,
    height: 90,
  },
  cardInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  pokemonId: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
    textTransform: "capitalize",
  },

  // Tipos
  typesRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  typeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  stat: {
    fontSize: 12,
    color: "#aaa",
  },

  // Error
  errorBox: {
    margin: 16,
    padding: 16,
    backgroundColor: "#3d0000",
    borderRadius: 10,
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 10,
  },
  retryBtn: {
    backgroundColor: "#EE1515",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Cargar más
  loadMoreBtn: {
    backgroundColor: "#EE1515",
    margin: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
