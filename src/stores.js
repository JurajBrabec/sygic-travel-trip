import { writable, derived } from 'svelte/store';
import { parseTrips, parseTrip, parseDay } from './helpers';

import sygicTravel from 'sygic-travel-ts';

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

let travel;

const execute = async (fn) => {
  let result;
  try {
    error.set();
    loading.set(true);
    result = await fn();
  } catch (err) {
    console.error(err);
    error.set(err.message);
  } finally {
    loading.set(false);
    return result;
  }
};
const create = (fn) =>
  execute(async () => {
    travel = await fn();
    await Promise.all([
      travel.getUser().then((data) => user.set(data)),
      travel.getTripList().then((data) => _trips.set(data)),
    ]);
  });
export const login = (params) => {
  return create(async () => {
    const travel = new sygicTravel.API();
    const { access_token, refresh_token } = await travel.login(params);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    return travel;
  });
};
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  user.set(null);
};
export const readHAR = (text) =>
  create(async () => {
    const travel = new sygicTravel.HAR();
    await travel.read(text);
    return travel;
  });

export const selectTrip = (id) =>
  execute(async () => {
    if (!id) return _trip.set();
    _trip.set(await travel.selectTrip(id));
    await selectDay(0);
  });

export const selectDay = (index) =>
  execute(async () => {
    paths.set();
    const [day, getPlaces, getPaths] = await travel.selectDay(index);
    _day.set(day.itinerary);
    places.set(await getPlaces());
    paths.set(await getPaths());
  });

const access_token = localStorage.getItem('access_token');
const refresh_token = localStorage.getItem('refresh_token');
if (access_token)
  create(() => new sygicTravel.API({ access_token, refresh_token }));
