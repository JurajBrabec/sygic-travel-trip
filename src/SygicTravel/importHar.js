const SOURCE = 'har';

const PLACES_URL = '/places?ids';
const PATH_URL = '/directions/path';

let entries = [];
let tripId;

const set = (contents) => {
  const { log } =
    typeof contents === 'string' ? JSON.parse(contents) : contents;
  if (!log && !log.entries) entries = [];
  entries = log.entries.filter(
    ({ response }) =>
      response.status === 200 && /json/.test(response.content.mimeType)
  );
  tripId = entries
    .map(({ request }) => request.url)
    .filter((url) => url.includes('trips/') && !url.includes('/list'))
    .reduce((_, url) => url.split('/').pop(), null);
};

const get = (method, url, index) => {
  const originalUrl = url;
  if (url.includes(PLACES_URL)) url = PLACES_URL;
  const result = entries
    .filter(
      ({ request }) => request.method === method && request.url.includes(url)
    )
    .map(({ response }) => JSON.parse(response.content.text).data);

  let data = {};
  switch (url) {
    case PLACES_URL:
      const places = result
        .map((r) => r.places)
        .flat()
        .filter((p) => originalUrl.includes(p.id));
      data = { places };
      break;
    case PATH_URL:
      data = result[index];
      break;
    default:
      data = result[0];
  }
  return { data };
};

export default { source: SOURCE, get, set, tripId: () => tripId };
