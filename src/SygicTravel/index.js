import HAR from './importHar';
import { setSource } from './fetchData';
import auth from './auth';
import user, { init as userInit, getUser } from './user';
import places, { init as placesInit } from './places';
import paths, { init as pathsInit } from './paths';
import trip, { init as tripInit, getDay, getTrip } from './trip';

const logo_url = 'https://cdn.travel.sygic.com/persistent/svgz/sygic.svg';
const trip_url = 'https://cdn.travel.sygic.com/maps.sygic.com/img/wizard.png';

let done;

const login = async ({ access_token, username, password, device_code }) => {
  setSource();
  const error = await auth({
    access_token,
    username,
    password,
    device_code,
  });
  if (error) {
    if (done) return done(error);
    throw error;
  }
  getUser();
};

const parse = (type, contents) => {
  setSource(type.source, contents);
  getUser().then(() => getTrip(type.tripId()));
};

const init = ({ onUser, onTrip, onPlaces, onPaths, onDone } = {}) => {
  if (onUser) userInit({ onUser, onDone });
  if (onPlaces) placesInit({ onPlaces });
  if (onPaths) pathsInit({ onPaths });
  if (onTrip) tripInit({ onTrip, onDone });
  if (onDone) done = onDone;

  return {
    login,
    importHAR: (contents) => parse(HAR, contents),
    selectTrip: getTrip,
    selectDay: getDay,
    user,
    trip,
    places,
    paths,
  };
};

export default { init, logo_url, trip_url };
