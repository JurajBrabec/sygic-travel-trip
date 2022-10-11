const DEFAULT_CENTER = { lat: -34.397, lng: 150.644 };
const DEFAULT_ZOOM = 15;

let map;
let markers = [];
let infoWindow;
let directionsService;
let directionsDisplay;

export const TravelModes = ['DRIVING', 'TRANSIT', 'WALKING'];

const create = (container) => {
  if (!container) return;
  map = new google.maps.Map(container, {
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER,
  });
  infoWindow = new google.maps.InfoWindow();
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
};

const clearRoute = () => {
  directionsDisplay.set('directions', null);
  showMarkers();
  return;
};

const route = async ({
  origin,
  destination,
  travelMode = TravelModes[0],
  departure = null,
} = {}) => {
  if (!map) return;
  try {
    const response = await directionsService.route({
      origin,
      destination,
      transitOptions: {
        departureTime: departure ? new Date(departure) : null,
      },
      travelMode,
      unitSystem: google.maps.UnitSystem.METRIC,
    });
    hideMarkers();
    directionsDisplay.setDirections(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const setCenter = (position, maxZoom) => {
  if (!map) return;
  try {
    map.setCenter(position);
    if (maxZoom) {
      const bounds = new google.maps.LatLngBounds(position);
      map.setOptions({ maxZoom });
      map.fitBounds(bounds);
      google.maps.event.addListenerOnce(map, 'idle', () =>
        map.setOptions({ maxZoom: null })
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const hideMarkers = () => markers.forEach((m) => m.setMap(null));

const showMarkers = () => {
  if (!map) return;
  const bounds = new google.maps.LatLngBounds();
  markers.forEach((m) => {
    m.setMap(map);
    bounds.extend(m.getPosition());
  });
  map.setCenter(bounds.getCenter());
  map.fitBounds(bounds);
};

const addMarker = ({ position, label, title, onClick } = {}) => {
  let marker = markers.find(
    (m) =>
      m.position.lng() === position.lng && m.position.lat() === position.lat
  );
  if (marker) {
    marker.setLabel(`${marker.label}/${label}`);
    return;
  }
  marker = new google.maps.Marker({
    position,
    label,
    title,
    //    animation: google.maps.Animation.DROP,
    optimized: false,
  });
  marker.addListener('click', () => {
    infoWindow.close();
    infoWindow.setContent(marker.getTitle());
    infoWindow.open(marker.getMap(), marker);
  });

  if (onClick) marker.addListener('click', onClick);
  markers.push(marker);
};

const clearMarkers = () => {
  hideMarkers();
  markers = [];
};

const setMarkers = (result = []) => {
  if (!map) return;
  hideMarkers();
  markers = result;
  if (markers.length) showMarkers();
};

export default {
  TravelModes,
  create,
  route,
  clearRoute,
  setCenter,
  markers,
  addMarker,
  clearMarkers,
  hideMarkers,
  setMarkers,
  showMarkers,
};
