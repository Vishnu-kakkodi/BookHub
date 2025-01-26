
// 'use client';
// import Link from "next/link"
// import { Inter } from "next/font/google"
// import "./globals.css"
// import  {ReduxProvider}  from '../store/reduxProvider'
// import { Provider, useSelector } from "react-redux"
// import { RootState, store } from "../store/index"


// const inter = Inter({ subsets: ["latin"] })

// const isUserAuthenticated = useSelector((state: RootState) => state.auth.isUserAuthenticated);


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <Provider store={store}> 
//     <html lang="en">
//       <body className={`${inter.className} bg-gray-100`}>
//       <nav className="bg-white shadow-md">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16">
//               <div className="flex items-center">
//                 <Link href="/" className="text-xl font-bold text-gray-800">
//                   My App
//                 </Link>
//               </div>
//               <div className="flex items-center">
//                 <div className="mr-4">
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     className="px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//                 <Link
//                   href="/login"
//                   className="bg-primary hover:bg-primary-600 text-gray-700 px-4 py-2 rounded-md transition duration-300 ease-in-out"
//                 >
//                   Login
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </nav>
//         <main>{children}</main>
//       </body>
//     </html>
//     </Provider>

//   )
// }



// 'use client';

// import Link from "next/link";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Provider, useSelector } from "react-redux";
// import { RootState, store } from "../store/index";

// const inter = Inter({ subsets: ["latin"] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <Provider store={store}>
//       <html lang="en">
//         <body className={`${inter.className} bg-gray-100`}>
//           <nav className="bg-white shadow-md">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex items-center justify-between h-16">
//                 <div className="flex items-center">
//                   <Link href="/" className="text-xl font-bold text-gray-800">
//                     My App
//                   </Link>
//                 </div>
//                 <Navigation />
//               </div>
//             </div>
//           </nav>
//           <main>{children}</main>
//         </body>
//       </html>
//     </Provider>
//   );
// }

// // Separate navigation component to access Redux state
// const Navigation = () => {
//   const isUserAuthenticated = useSelector(
//     (state: RootState) => state.auth.isUserAuthenticated
//   );

//   return (
//     <div className="flex items-center">
//       <div className="mr-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
//         />
//       </div>
//       {isUserAuthenticated ? (
//         <>
//           <Link
//             href="/account"
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
//           >
//             Account
//           </Link>
//           <button
//             onClick={() => {
//               dispatch(userLogout())
//             }}
//             className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
//           >
//             Logout
//           </button>
//         </>
//       ) : (
//         <Link
//           href="/login"
//           className="bg-primary hover:bg-primary-600 text-gray-700 px-4 py-2 rounded-md transition duration-300 ease-in-out"
//         >
//           Login
//         </Link>
//       )}
//     </div>
//   );
// };





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
                <p>BookHub</p>
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
