
'use client';

import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../store/index";
import { userLogout } from "../store/slices/authSlice"; // Replace with the actual path to your authSlice

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${inter.className} bg-orange-300`}>
          <nav className="bg-orange-200 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link href="/home">
                  <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#4A90E2',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontFamily: 'Arial, sans-serif',
                    margin: '0',
                    padding: '10px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  }}>
                    BookHub
                  </p>
                </Link>
                <Navigation />
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </body>
      </html>
    </Provider>
  );
}

// Separate navigation component to access Redux state
const Navigation = () => {
  const dispatch = useDispatch();
  const isUserAuthenticated = useSelector(
    (state: RootState) => state.auth.isUserAuthenticated
  );

  const handleLogout = () => {
    dispatch(userLogout());
  };

  return (
    <div className="flex items-center">
      {isUserAuthenticated ? (
        <>
          <Link
            href="/search"
            className="hover:text-blue-600 text-blue-500 px-4 py-2 rounded-md transition duration-300 ease-in-out"
          >
            Search
          </Link>
          <Link
            href="/profile"
            className="hover:text-blue-600 text-blue-500 px-4 py-2 rounded-md transition duration-300 ease-in-out"
          >
            Profile
          </Link>
          <Link
            href="/my-books"
            className="hover:text-blue-600 text-blue-500 px-4 py-2 rounded-md transition duration-300 ease-in-out"
          >
            My Books
          </Link>
          <button
            onClick={handleLogout}
            className="ml-4 hover:text-red-600 text-red-500 px-4 py-2 rounded-md transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </>

      ) : (
        <Link
          href="/login"
          className="bg-primary hover:bg-primary-600 text-gray-700 px-4 py-2 rounded-md transition duration-300 ease-in-out"
        >
          Login
        </Link>
      )}
    </div>
  );
};
