import fetchData from './fetchData';

const MARKERS_URL = 'https://cdn.travel.sygic.com/web/markers/';

let callback;
let places = new Map();

const addPlace = (place) =>
  places.set(place.id, {
    ...place,
    marker_url:
      MARKERS_URL +
      (place.marker === 'default' ? 'home' : place.marker) +
      '.png',
  });

export const getPlace = async (placeId) => {
  if (places.has(placeId)) return places.get(placeId);
  const response = await fetchData('GET', '/places/' + placeId);
  addPlace(response.data.place);
  if (callback) callback(Array.from(places));
};

export const getPlaces = async (placeIds = []) => {
  const response = await fetchData('GET', '/places?ids=' + placeIds.join('|'));
  response.data.places.forEach(addPlace);
  if (callback) callback(Array.from(places));
};

export const init = ({ onPlaces }) => {
  if (onPlaces) callback = onPlaces;
};

export default () => places;
