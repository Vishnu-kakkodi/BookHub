import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id?: string;
  email?: string;
  userName?: string;
  [key: string]: any;
}

interface AuthState {
  userInfo: UserInfo | null;
  isUserAuthenticated: boolean;
}

const initialState: AuthState = {
  userInfo: null, // Hydrated later
  isUserAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isUserAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
    hydrateUser: (state) => {
      if (typeof window !== "undefined") {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          state.userInfo = JSON.parse(userInfo);
          state.isUserAuthenticated = true;
        }
      }
    },
    userLogout: (state) => {
      state.userInfo = null;
      state.isUserAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
      }
    },
  },
});

export const { setCredentials, hydrateUser, userLogout } = authSlice.actions;

export default authSlice.reducer;
