let request;

if (typeof window === 'undefined') {
  request = require('undici').request;
} else {
  request = async () => {
    throw new Error('undici can only be used on the server-side');
  };
}

export const buildClient = () => {
  let baseURL = '';

  if (typeof window === 'undefined') {
    baseURL = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
  } else {
    baseURL = 'https://ticketing.dev';
  }

  return async (endpoint, options = {}) => {
    const url = `${baseURL}${endpoint}`;

    let headers = {};
    if (typeof window === 'undefined') {
      const { headers: getHeaders } = require('next/headers');
      const serverHeadersInstance = getHeaders();
      serverHeadersInstance.forEach((value, key) => {
        headers[key] = value;
      });
    } else {
      headers = options.headers || {};
    }

    if (typeof window === 'undefined') {
      const response = await request(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });
      const data = await response.body.json();

      return { status: response.statusCode, data };
    } else {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        credentials: 'include',
      });
      const data = await response.json();

      return { status: response.status, data };
    }
  };
};
