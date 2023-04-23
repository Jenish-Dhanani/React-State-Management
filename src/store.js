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

  const [{ search, page }, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_SEARCH":
          return { ...state, search: action.payload, page: 0 };
        case "SET_PAGE":
          return { ...state, page: action.payload };
        default:
          return state;
      }
    },
    {
      search: "",
      page: 1,
    }
  );

  const setSearch = useCallback((search) => {
    dispatch({
      type: "SET_SEARCH",
      payload: search,
    });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({
      type: "SET_PAGE",
      payload: page,
    });
  }, []);

  const filteredPokemon = useMemo(
    () =>
      pokemon
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
        // .slice(page * 20, (page + 1) * 20),
    [pokemon, search, page]
  );

  const sortedPokemon = useMemo(
    () => [...filteredPokemon].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredPokemon]
  );

  const paginatedPokemon = useMemo(
    ()=> [...sortedPokemon].slice(page * 20 - 20, page * 20),
    [sortedPokemon]
  )

  const totalPages = useMemo(() => Math.floor(pokemon.length / 20), [pokemon]);

  return { pokemon: paginatedPokemon, search, setSearch, page, setPage, totalPages };
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
