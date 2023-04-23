import { usePokemon } from "./store";
import { PokemonProvider } from "./store";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// routing react location
import {
  Link,
  useMatch,
  Router,
  ReactLocation,
  Outlet,
} from "@tanstack/react-location";
import React from "react";

const queryClient = new QueryClient();
const location = new ReactLocation();

const routes = [
  {
    path: "/",
    element: (
      <React.Fragment>
        <SearchBox />
        <PokemonList />
      </React.Fragment>
    ),
  },
  {
    path: "/pokemon/:id",
    element: <PokemonDetail />,
  },
];

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PokemonProvider>
        <Router routes={routes} location={location}>
          <div className="App">
            <Outlet />
          </div>
        </Router>
      </PokemonProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function SearchBox() {
  const { search, setSearch } = usePokemon();
  return (
    <input
      className="mt-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-800 focus:ring-indigo-800 sm:text-lg p-2"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

function PokemonList() {
  const { pokemon } = usePokemon();
  return (
    <React.Fragment>
      {pokemon.length === 0 && <div className="text-center m-12">
        <h1 className="text-4xl text-blue-500">No Pokemon Found</h1>
      </div>}
      {
        pokemon.length > 0 && <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-3">
          {pokemon.map((p) => (
            <li
              key={p.id}
              className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
            >
              <Link to={`/pokemon/${p.id}`}>
                <div className="flex-1 flex flex-col p-8">
                  <img
                    className="w-32 h-32 flex-shrink-0 mx-auto bg-black rounded-full"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                    alt=""
                  />
                  <h3 className="mt-6 text-gray-900 text-sm font-medium">
                    {p.name}
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>}
      <Pagination />
    </React.Fragment>
  );
}

// pokemon detail
function PokemonDetail() {
  const {
    params: { id },
  } = useMatch();
  const { pokemon } = usePokemon();

  const pokemonData = pokemon.find((p) => p.id === +id);

  if (!pokemonData) {
    return <div>No pokemon found</div>;
  }

  const getColorClass = (index) => {
    const colors = [
      "bg-red-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-yellow-500",
      "bg-yellow-500",
      "bg-green-500",
    ];
    return colors[index];
  };

  return (
    <div className="mt-3">
      <Link to="/">
        <h1 className="text-2xl font-bold mb-5">🏠 Home</h1>
      </Link>
      <div className="w-full">
        <div
          className="m-auto overflow-hidden rounded-lg bg-white shadow-md"
          style={{ width: "450px" }}
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <div>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`}
                alt={pokemonData.name || "Pokemon Image"}
                className="h-32 w-32 rounded-full bg-gray-200 p-1"
              />
              <h2 className="mt-2 text-3xl font-bold text-white">
                {pokemonData.name}
              </h2>
            </div>
            <div className="flex flex-col items-end justify-evenly">
              {pokemonData.type.map((type) => (
                <div
                  key={type}
                  className="my-1 rounded-full bg-white px-2 py-1 text-sm font-bold text-blue-500"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            {[
              "hp",
              "attack",
              "defense",
              "special_attack",
              "special_defense",
              "speed",
            ].map((stat, index) => (
              <div key={stat}>
                <div className="mt-1 text-lg font-bold tracking-wider text-gray-800">
                  {stat}
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-300">
                  <div
                    className={`h-2 w-${Math.floor(
                      (pokemonData[stat] / 100) * 5
                    )}/5 rounded-full ${getColorClass(index)}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function Pagination() {
  const { page, totalPages, setPage } = usePokemon()

  return (
    <div className="flex justify-center items-center my-12">
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-4 py-2 mr-2"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>
      <div>
        <p>
          {page} / {totalPages}
        </p>
      </div>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-4 py-2 ml-2"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}