import HAR from './importHar';

const VERSION = '2.6';
const LANGUAGE = 'en';

const API_URL = 'https://api.sygictraveldata.com/v' + VERSION + '/';

let auth = {};
let importFrom = null;

export const setAuth = (newAuth = {}) => {
  auth = newAuth;
};

export const setSource = (type = null, contents = '') => {
  importFrom = type;
  switch (importFrom) {
    case HAR.source:
      HAR.set(contents);
      break;
  }
};

const fetchUrl = async (method, url, body, headers) => {
  if (!headers) {
    if (!auth.access_token) throw new Error('Not authenticated');
    headers = { Authorization: `Bearer ${auth.access_token}` };
  }
  const options = { method, headers };
  if (method === 'POST') options.body = JSON.stringify(body);
  if (!/^http/.test(url)) url = API_URL + LANGUAGE + url;
  const response = await fetch(url, options);
  if (response.status !== 200)
    throw new Error(`${response.status} : ${response.statusText}`);
  return response.json();
};

export default async (method, url, body, headers, index) => {
  switch (importFrom) {
    case null:
      return fetchUrl(method, url, body, headers);
    case HAR.source:
      return HAR.get(method, url, index);
    default:
      throw new Error('Invalid source ' + importFrom);
  }
};
