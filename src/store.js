import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { useQuery } from "react-query";

const usePokemonSource = () => {
  //useQuey hook tanstack
  const { data: pokemon } = useQuery(
    ["pokemon"],
    () => fetch("/pokemon.json").then((res) => res.json()),
    {
      initialData: [],
    }
  );

  const [{ search }, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_SEARCH":
          return { ...state, search: action.payload };
        default:
          return state;
      }
    },
    {
      search: "",
    }
  );

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
