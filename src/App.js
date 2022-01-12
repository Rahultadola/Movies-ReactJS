import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie'
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-8e66d-default-rtdb.firebaseio.com/movies.json');
      if(!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      const loadedMovies = [];
      
      for( const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }
      console.log(loadedMovies)
      setMovies(loadedMovies);      
    } catch (error) {
      setError(error.message)
    }    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-8e66d-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json()
    
   console.log(data);
  }

  let contnent = <p>Click 'Fetch Movies' button to load movies.</p>;

  if (movies.length > 0) {
    contnent = <MoviesList movies={movies} />;
  }

  if (error) {
    contnent = <p>{error}</p>;
  }

  if (loading) {
    contnent = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {contnent}
      </section>
    </React.Fragment>
  );
}

export default App;
