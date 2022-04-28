import fetchData from './fetchData';
import places, { getPlace, getPlaces } from './places';
import { getPaths, getWayPoints } from './paths';

let callback;
let done;
let trip = null;
let trips = new Map();

export const getTrip = async (tripId = trip) => {
  try {
    if (!tripId) throw new Error('No trip selected');
    if (!trips.has(tripId)) {
      const response = await fetchData('GET', '/trips/' + tripId);
      trips.set(tripId, response.data.trip);
      trip = tripId;
      getDay(0);
    }
    getPlaces(trips.get(trip).destinations);
    if (callback) callback({ trip: trips.get(trip) });
  } catch (error) {
    if (done) return done(error);
    throw error;
  }
};

export const getDay = async (day = 0) => {
  try {
    if (!trip) throw new Error('No trip selected');
    const { itinerary } = trips.get(trip).days[day];
    if (callback) callback({ itinerary });

    const newPlaceIds = itinerary
      .map(({ place_id }) => place_id)
      .filter((place_id) => !places().has(place_id));

    if (newPlaceIds.length === 1) await getPlace(newPlaceIds[0]);
    if (newPlaceIds.length > 1) await getPlaces(newPlaceIds);

    await getPaths(trip, day, await getWayPoints(itinerary));
    if (done) done();
  } catch (error) {
    if (done) return done(error);
    throw error;
  }
};

export const init = ({ onTrip, onDone }) => {
  if (onTrip) callback = onTrip;
  if (onDone) done = onDone;
};

export default () => trips.get(trip);
