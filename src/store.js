import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";

const usePokemonSource = () => {
  const [{ pokemon, search }, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_POKEMON":
          return { ...state, pokemon: action.payload };
        case "SET_SEARCH":
          return { ...state, search: action.payload };
        default:
          return state;
      }
    },
    {
      pokemon: [],
      search: "",
    }
  );

  useEffect(() => {
    (async function () {
      await fetch("/pokemon.json")
        .then((res) => res.json())
        .then((data) => dispatch({ type: "SET_POKEMON", payload: data }));
    })();
  }, []);

  const setSearch = useCallback((search) => {
    dispatch({
      type: "SET_SEARCH",
      payload: search,
    });
  }, []);

  const filteredPokemon = useMemo(
    () =>
      pokemon
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 20),
    [pokemon, search]
  );

  const sortedPokemon = useMemo(
    () => [...filteredPokemon].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredPokemon]
  );
  return { pokemon: sortedPokemon, search, setSearch };
};

const pokemonContext = createContext();

export function usePokemon() {
  return useContext(pokemonContext);
}

export function PokemonProvider({ children }) {
  return (
    <pokemonContext.Provider value={usePokemonSource()}>
      {children}
    </pokemonContext.Provider>
  );
}
