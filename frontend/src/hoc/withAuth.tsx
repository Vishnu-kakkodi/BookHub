// import { usePathname, useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store"; 
// import { useEffect } from "react";

// const withAuth = (WrappedComponent: React.ComponentType) => {
//   const AuthenticatedComponent = (props: any) => {
//     const router = useRouter();
//     const pathname = usePathname();
//     const isAuthenticated = useSelector((state: RootState) => state.auth.isUserAuthenticated);

//     useEffect(() => {
//         console.log(isAuthenticated)
//         if (!isAuthenticated) {
//           if(pathname === "register"){
//             router.push("/register"); 
//           }else if(pathname === "login"){
//             router.push("/login"); 
//           }else if(pathname === "/"){
//             router.push("/"); 
//           }
//         } else if (pathname === "/login" || pathname === "/register" || pathname === "/") {
//             router.push("/home");
//           }
//       }, [isAuthenticated, router]);
      

//     if (!isAuthenticated) return null;

//     return <WrappedComponent {...props} />;
//   };

//   return AuthenticatedComponent;
// };

// export default withAuth;


import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store"; 
import { useEffect } from "react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isUserAuthenticated);

    const publicPages = ["/login", "/register", "/"];

    useEffect(() => {
      if (!isAuthenticated) {
        if (!publicPages.includes(pathname)) {
          router.push("/login"); 
        }
      } else {
        if (publicPages.includes(pathname)) {
          router.push("/home"); 
        }
      }
    }, [isAuthenticated, pathname, router]);

    if (!isAuthenticated && !publicPages.includes(pathname)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;

