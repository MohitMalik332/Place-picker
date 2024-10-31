import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from '../http.js';


export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  // without using useEffect this will cause an infinite loop.
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places =  await fetchAvailablePlaces();

        // to show the places in sorted order accord to user's location
        navigator.geolocation.getCurrentPosition((position) => {
          const sortPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortPlaces);
          setIsFetching(false);
        })

      } catch (error) {
        setError({
          message: error.message || 'Could not fetch places, please try again later.'
        });
        setIsFetching(false);
      }

    }

    fetchPlaces();
  }, []);

  if (error){
    return <Error title="An error occured!" message={error.message}/>
  }
  


  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
