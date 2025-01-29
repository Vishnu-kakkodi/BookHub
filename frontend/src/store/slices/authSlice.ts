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

const getFromStorage = (key: string) => {
  const localItem = localStorage.getItem(key);
  return localItem ? JSON.parse(localItem) : null;
};

const initialState: AuthState = {
  userInfo: getFromStorage("userInfo"),
  isUserAuthenticated: !!localStorage.getItem("userInfo"),
};

interface UpdateUserFieldPayload {
  field: keyof UserInfo;
  value: any;
}



const setToStorage = (key: string, value: any) => {
  const stringValue = JSON.stringify(value);
  localStorage.setItem(key, stringValue);
};

const removeFromStorage = (key: string) => {
  localStorage.removeItem(key);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isUserAuthenticated = true;
      setToStorage("userInfo", action.payload);
    },
    // hydrateUser: (state) => {
    //   if (typeof window !== "undefined") {
    //     const userInfo = localStorage.getItem("userInfo");
    //     if (userInfo) {
    //       state.userInfo = JSON.parse(userInfo);
    //       state.isUserAuthenticated = true;
    //     }
    //   }
    // },
    userLogout: (state) => {
      state.userInfo = null;
      state.isUserAuthenticated = false;
      removeFromStorage("userInfo");
    },
    updateUserField: (state, action: PayloadAction<UpdateUserFieldPayload>) => {
      if (state.userInfo) {
        const { field, value } = action.payload;
        state.userInfo = {
          ...state.userInfo,
          [field]: value
        };
        setToStorage("userInfo", state.userInfo);
      }
    },
  },
});

export const { setCredentials, userLogout, updateUserField } = authSlice.actions;

export default authSlice.reducer;
