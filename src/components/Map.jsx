import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import 'leaflet/dist/leaflet.css';
import { Marker, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';


export default function Map() {
  const [positions, setPositions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const geo = navigator.geolocation

  useEffect(() => {
    let watchId;

    if (isTracking && geo) {
      watchId = geo.watchPosition(handleLocation, handleError);
    }

    return () => {
      if (watchId) geo.clearWatch(watchId);
    };
  }, [isTracking]);


  useEffect(() => {
    if (geo) {
      geo.getCurrentPosition((position) => setCurrentLocation([position.coords.latitude, position.coords.longitude]), handleError);
      console.log("Geolocation is supported.");
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

  }, [])

  function handleLocation(position) {
    console.log("Current position: ", position);

    const { latitude, longitude } = position.coords;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    setPositions((prevPositions) => [
      ...prevPositions,
      [latitude, longitude]
    ]);
  }

  function handleError(error) {
    console.log("Error getting location: ", error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }
  return (
    <div className='container'>
      <MapContainer center={currentLocation ? currentLocation : [40.501536, 71.019987]} zoom={13} style={{ height: '100vh', width: '100vw' }}>
        <TileLayer

          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright
        ">OpenStreetMap</a> contributors'
        />

        {
          isTracking && positions.length > 0 && (
            <Polyline positions={positions} color="blue" />
          )
        }

        <Marker position={currentLocation ? currentLocation : [40.501536, 71.019987]} />
      </MapContainer>

      <div className='absolute'>
        {
          isTracking ? (
            <button onClick={() => setIsTracking(false)} className='stop'>Stop Tracking</button>
          ) : (
            <button onClick={() => setIsTracking(true)} className='start'>Start Tracking</button>
          )
        }
      </div>
    </div>
  )
}