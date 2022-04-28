import SygicTravel from './SygicTravel';
import { writable, derived } from 'svelte/store';
import { parseTrips, parseTrip, parseDay } from './helpers';

export const error = writable();
export const loading = writable(false);
export const user = writable();
const _trips = writable();
const _trip = writable();
const _day = writable();
const paths = writable();
const places = writable();

export const trips = derived(_trips, ($_trips) => parseTrips($_trips));
export const trip = derived(_trip, ($_trip) => parseTrip($_trip));
export const day = derived([_day, paths, places], ([$day, $paths, $places]) =>
  parseDay({ day: $day, paths: $paths, places: $places })
);

const travel = SygicTravel.init({
  onUser: (data) => {
    if (data.user) user.set(data.user);
    if (data.tripList) _trips.set(data.tripList);
  },
  onTrip: (data) => {
    if (data.trip) _trip.set(data.trip);
    if (data.itinerary) _day.set(data.itinerary);
  },
  onPlaces: (data) => places.set(data),
  onPaths: (data) => paths.set(data),
  onDone: (err) => {
    loading.set(false);
    error.set(err);
  },
});

export const login = (params) => {
  error.set();
  loading.set(true);
  travel.login(params);
};

export const readHAR = (text) => {
  error.set();
  loading.set(true);
  travel.importHAR(text);
};

export const selectTrip = (id) => {
  error.set();
  if (!id) return _trip.set();
  loading.set(true);
  travel.selectTrip(id);
};

export const selectDay = (index) => {
  error.set();
  loading.set(true);
  travel.selectDay(index);
};
