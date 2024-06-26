import { useState } from 'react';

export const useRequest = ({ url, method, body }) => {
  const [errors, setErrors] = useState([]);

  const doRequest = async () => {
    setErrors([]);

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const payload = await response.json();

    if (response.ok) {
      return payload;
    } else {
      setErrors(payload.errors);
    }
  }

  return { doRequest, errors };
}