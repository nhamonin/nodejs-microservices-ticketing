'use client';

import React, { useEffect, useState } from 'react';
import { fetchUser } from '../api/fetchUser';

const LandingPage = ({ initialUser }) => {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(
    !initialUser || Object.keys(initialUser).length === 0,
  );

  useEffect(() => {
    if (initialUser && Object.keys(initialUser).length > 0) {
      setUser(initialUser);
      setLoading(false);
      return;
    }

    const getUser = async () => {
      const userData = await fetchUser();
      setUser(userData);
      setLoading(false);
    };

    getUser();
  }, [initialUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user?.email ? (
    <div>Hello, {user.email}</div>
  ) : (
    <div>Please sign in</div>
  );
};

export default LandingPage;
