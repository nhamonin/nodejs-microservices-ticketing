'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import { useRequest } from '../hooks/useRequest';

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const { doRequest } = useRequest({
    url: '/api/users/sign-out',
    method: 'post',
    body: {},
    onSuccess: () => {
      signOut();
      router.push('/auth/signin');
    },
  });

  const handleSignOut = async () => {
    await doRequest();
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto">
        <nav>
          <ul className="flex justify-between items-center w-full">
            <div>
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
            </div>
            <div className="flex gap-4">
              {loading ? (
                <li>Loading...</li>
              ) : !user ? (
                <>
                  <li>
                    <Link href="/auth/signup" className="hover:underline">
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/signin" className="hover:underline">
                      Sign In
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button onClick={handleSignOut} className="hover:underline">
                    Sign Out
                  </button>
                </li>
              )}
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
