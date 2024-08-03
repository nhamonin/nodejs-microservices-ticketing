import React from 'react';

import { fetchUser } from './api/fetchUser';
import LandingPage from './components/LandingPage';

const Home = async () => {
  const initialUser = await fetchUser();

  return <LandingPage initialUser={initialUser} />;
};

export default Home;
