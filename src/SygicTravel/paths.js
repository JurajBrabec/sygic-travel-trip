import fetchData from './fetchData';
import places from './places';

const PATH_BODY = {
  arrive_at: null,
  avoid: [],
  depart_at: null,
  destination: null,
  origin: null,
  modes: null,
  waypoints: [],
};

let callback;
let paths = new Map();

export const getPaths = async (tripId, day = 0, wayPoints = []) => {
  const result = paths.get(tripId) || new Map();
  if (!result.has(day)) {
    const response = await fetchData(
      'POST',
      '/directions/path',
      wayPoints,
      null,
      day
    );
    result.set(day, response.data.path);
    paths.set(tripId, result);
  }
  if (callback) callback(Array.from(result.get(day)));
  return result.get(day);
};

export const getWayPoints = async (itinerary) => {
  let origin = null;
  return itinerary.reduce((wayPoints, item) => {
    const destination = places().get(item.place_id);
    if (origin)
      wayPoints.push({
        ...PATH_BODY,
        origin: origin.location,
        destination: destination.location,
      });
    origin = destination;
    return wayPoints;
  }, []);
};

export const init = ({ onPaths }) => {
  if (onPaths) callback = onPaths;
};

export default () => paths;
