import { buildClient } from '../lib/buildClient';

export async function fetchUser() {
  const client = buildClient();

  try {
    const { data } = await client('/api/users/current', {
      method: 'GET',
    });

    return data.currentUser;
  } catch (err) {
    return { error: err.message };
  }
}
