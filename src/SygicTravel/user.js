import fetchData from './fetchData';
import { getPlaces } from './places';

let callback;
let done;
let user;

const getInfo = async () => {
  const response = await fetchData('GET', '/user/info');
  user = { ...user, ...response.data.user };
};

const getMe = async () => {
  const response = await fetchData('GET', '/users/me');
  const { settings } = response.data;
  user.settings = settings;
  const { home_place_id, work_place_id } = settings;
  getPlaces([home_place_id, work_place_id].filter((id) => id));
};

export const getTripList = async () => {
  if (!user.tripList) {
    const response = await fetchData('GET', '/trips/list');
    user.tripList = response.data.trips;
  }
  if (callback) callback({ tripList: user.tripList });
  if (done) done();
};

export const getUser = async () => {
  try {
    if (!user) {
      user = {};
      await Promise.all([getInfo(), getMe()]);
      getTripList();
    }
    if (callback) callback({ user });
  } catch (error) {
    if (done) return done(error);
    throw error;
  }
};

export const init = ({ onUser, onDone }) => {
  if (onUser) callback = onUser;
  if (onDone) done = onDone;
};

export default () => user;
