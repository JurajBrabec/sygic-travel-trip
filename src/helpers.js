const SIZE = '400x300';

export const Modes = new Map(
  Object.entries({
    boat: 'bx bx-anchor',
    bus: 'bx bx-bus',
    car: 'bx bx-car',
    pedestrian: 'bx bx-walk',
    plane: 'bx bx-paper-plane',
    public_transit: 'bx bx-train',
    taxi: 'bx bx-taxi',
    train: 'bx bx-train',
    tram: 'bx bx-train',
    subway: 'bx bx-train',
  })
);

export const Names = new Map(
  Object.entries({
    mode: 'T',
    duration: 'Time',
    distance: 'km/m',
    start: 'Arrive',
    marker: '',
    name: 'Name / Address / Note',
    stay: 'Stay',
    end: 'Leave',
  })
);

export const bgStyle = (media) => {
  const template = media?.landscape?.url_template || '';
  const url = template.replace('{size}', SIZE);
  return url ? `background-image:url(${url})` : '';
};

export const createReader = (onText) => {
  const reader = new FileReader();
  reader.onload = (event) => onText(event.target.result);
  return reader;
};

export const sortByDateDesc = (a, b) =>
  new Date(b.starts_on).getTime() - new Date(a.starts_on).getTime();

export const formatDateTime = (date, addDays = 0) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const d = new Date(date);
  if (addDays) d.setDate(d.getDate() + addDays);
  // @ts-ignore
  return d.toLocaleDateString(undefined, options);
};

export const formatDistance = (meters, addMeters = 0) => {
  if (!meters) return '';
  meters += addMeters;
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
};

export const formatDuration = (seconds, addSeconds = 0) => {
  if (!seconds) return '';
  seconds += addSeconds;
  let hours = Math.floor(seconds / (60 * 60));
  let mins = Math.floor(seconds / 60 - hours * 60);
  if (seconds > (hours * 60 + mins) * 60) mins++;
  if (!hours) return `${mins}min`;
  const prefix = mins < 10 ? '0' : '';
  return `${hours}:${prefix + mins}`;
};

export const parseTrips = (trips = []) =>
  trips.sort(sortByDateDesc).map((trip) => {
    const { media, starts_on, ends_on, day_count } = trip;
    const style = bgStyle(media);
    const description = `${starts_on} - ${ends_on} (${day_count} days)`;
    return { ...trip, style, start: starts_on, description };
  });

export const parseTrip = (trip = {}) => {
  const { id, media, starts_on, ends_on } = trip;
  if (!id) return;
  const style = bgStyle(media);
  const description = `${formatDateTime(starts_on)} - ${formatDateTime(
    ends_on
  )}`;
  return { ...trip, style, description };
};
export const parseDay = ({ day = [], paths = [], places = [] } = {}) => {
  let end;
  let placeName;

  const getDirection = (index, route_id) => {
    if (index === 0 || index > paths.length) return {};
    const { directions } = paths[index - 1];
    if (!directions || !directions.length) return {};
    return directions.find((d) => d.route_id === route_id) || directions[0];
  };

  const getPlace = (place_id) => places.find(({ id }) => id === place_id) || {};

  return day.map((item, index) => {
    if (!index) end = null;

    const {
      start_time,
      transport_from_previous,
      place_id,
      duration: stay,
      note,
    } = item;

    const { marker, marker_url, name, name_local, address, location } =
      getPlace(place_id);
    const {
      mode: tMode,
      start_time: tStart,
      duration: tDuration,
      note: tNote,
      route_id,
    } = transport_from_previous || {};
    const tName = placeName ? `${placeName} - ${name_local || name}` : '';

    const {
      distance,
      duration: dDuration,
      mode: dMode,
    } = getDirection(index, route_id);

    const duration = tDuration || dDuration;
    const mode = tMode || dMode;

    const transport = transport_from_previous && mode !== 'pedestrian';

    const start = tStart
      ? tStart + tDuration
      : 0 || start_time || (end || 8 * 60 * 60) + (tDuration || duration || 0);

    end = start + stay || 0;
    placeName = name_local || name;

    const important = stay >= 30 * 60 && stay < 60 * 60;
    const long = stay >= 60 * 60;
    const lunch = /obed/i.test(note);

    return {
      transport,
      distance: formatDistance(distance),
      tStart: tStart ? formatDuration(tStart) : '',
      tName,
      tNote: tNote || '',
      tEnd: tStart ? formatDuration(tStart + (duration || 0)) : '',
      mode,
      marker,
      duration: formatDuration(duration),
      start: formatDuration(start),
      marker_url,
      name: placeName || '',
      address: address || '',
      note: note || '',
      stay: formatDuration(stay),
      end: formatDuration(end),
      important,
      long,
      lunch,
      location,
    };
  });
};
