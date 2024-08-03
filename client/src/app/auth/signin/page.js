'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequest } from '../../hooks/useRequest';
import { useAuth } from '@/app/context/AuthContext';

const Signin = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { doRequest, errors } = useRequest({
    url: '/api/users/sign-in',
    method: 'post',
    body: form,
    onSuccess: (data) => {
      signIn(data);
      router.push('/');
    },
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-xl font-semibold text-center mb-6">Sign In</h1>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your password"
        />
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
          <ul className="list-disc pl-3">
            {errors.map(({ message }) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Sign In
      </button>
    </form>
  );
};

export default Signin;
