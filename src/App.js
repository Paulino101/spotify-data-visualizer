import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const client_id = "1fe9102771f64b3e92c86f1f5736e02d";
  const redirect_uri = "http://localhost:3000";
  const auth_endpoint = "https://accounts.spotify.com/authorize";
  const response_type = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artist, setArtists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    if (access_token) {
      setToken(access_token);
      window.localStorage.setItem("token", access_token);
      window.location.hash = "";
    }
  }, []);

  const handleLogout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: "artist",
        },
      });
      console.log(data);
      setArtists(data.artists.items);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTopArtists = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setTopArtists(data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTopTracks = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data.items);
      setTopTracks(data.items);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <h1>Spotify Api</h1>
      {!token ? (
        <a
          href={`${auth_endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=user-top-read`}
        >
          login
        </a>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}

      {token ? (
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      ) : null}
      {/* eventually make a new component from this > */}
      {artist ? (
        artist.map((art) => (
          <>
            <h1>{art.name}</h1>
            <img
              className="w-50"
              src={
                art.images.length > 0
                  ? art.images[0].url
                  : console.log("no images")
              }
            />
          </>
        ))
      ) : (
        <h1>Waiting for Search</h1>
      )}
      <button onClick={handleTopArtists}>Top Artists</button>
      {topArtists !== []
        ? topArtists.map((artist) => (
            <>
              <h1>{artist.name}</h1>
              <img
                className="w-50"
                src={
                  artist.images.length > 0
                    ? artist.images[0].url
                    : console.log("no images")
                }
              />
            </>
          ))
        : null}
      <button onClick={handleTopTracks}>Top Tracks</button>
      {topTracks !== []
        ? topTracks.map((track) => (
            <>
              <h1>{track.name}</h1>
            </>
          ))
        : null}
    </div>
  );
}

export default App;
