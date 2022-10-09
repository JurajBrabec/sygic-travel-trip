import fetchData, { setAuth } from './fetchData';

const AUTH_BODY = {
  client_id: 'sygictravel_web',
  device_code: null,
  device_platform: 'web',
  grant_type: 'password',
  username: null,
  password: null,
};
const AUTH_HEADERS = { 'Content-Type': 'application/json' };
const AUTH_URL = 'https://auth.sygic.com/oauth2/token';

const DEVICE_CODE = '38d561c7-65d4-4c77-ad92-1ee5c30ca36b';

export default async ({
  access_token,
  refresh_token,
  username,
  password,
  device_code = DEVICE_CODE,
}) => {
  try {
    if (access_token) {
      setAuth({ access_token, refresh_token });
    } else {
      const body = { ...AUTH_BODY, username, password, device_code };
      setAuth(await fetchData('POST', AUTH_URL, body, AUTH_HEADERS));
    }
  } catch (error) {
    return error;
  }
};
