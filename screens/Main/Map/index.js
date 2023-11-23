import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const dangerLevels = [
  { name: 'Central Park', latitude: -1.286389, longitude: 36.817223, danger: 'high' },
  { name: 'Nairobi Railway Museum', latitude: -1.2897, longitude: 36.8211, danger: 'low' },
  { name: 'City Market', latitude: -1.2921, longitude: 36.8219, danger: 'medium' },
  { name: 'National Archives', latitude: -1.286, longitude: 36.8175, danger: 'high' },
  { name: 'Kenyatta International Conference Centre', latitude: -1.2928, longitude: 36.8217, danger: 'low' },
  { name: 'Uhuru Park', latitude: -1.2839, longitude: 36.8221, danger: 'medium' },
  { name: 'Karen Blixen Museum', latitude: -1.3054, longitude: 36.7598, danger: 'low' },
  { name: 'Giraffe Centre', latitude: -1.3876, longitude: 36.7474, danger: 'medium' },
  { name: 'David Sheldrick Wildlife Trust', latitude: -1.4067, longitude: 36.7183, danger: 'high' },
  { name: 'Bomas of Kenya', latitude: -1.3569, longitude: 36.7367, danger: 'medium' },
  { name: 'Nairobi National Museum', latitude: -1.2716, longitude: 36.8118, danger: 'low' },
];

const policeStations = [
  { name: 'Police Station A', latitude: -1.2805, longitude: 36.8164 },
  { name: 'Police Station B', latitude: -1.2902, longitude: 36.8219 },
  { name: 'Police Station C', latitude: -1.2853, longitude: 36.8297 },
  { name: 'Police Station D', latitude: -1.2809, longitude: 36.8216 },
  { name: 'Police Station E', latitude: -1.2873, longitude: 36.8147 },
  { name: 'Police Station F', latitude: -1.2832, longitude: 36.8268 },
  { name: 'Police Station G', latitude: -1.2881, longitude: 36.8223 },
  { name: 'Police Station H', latitude: -1.2897, longitude: 36.8179 },
];

function Map() {
  const getMarkerColor = (dangerLevel) => {
    switch (dangerLevel) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'blue'; // Default color if danger level is not specified
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -1.286389,
          longitude: 36.817223,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {dangerLevels.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={`Danger Level: ${place.danger}`}
            pinColor={getMarkerColor(place.danger)}
          />
        ))}

        {policeStations.map((station, index) => (
          <Marker
            key={index + dangerLevels.length} // Avoid key conflicts
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={station.name}
            pinColor="blue" // Assuming blue color for police stations
          />
        ))}
      </MapView>
    </View>
  );
}

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
