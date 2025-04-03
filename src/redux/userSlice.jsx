import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    token: "",
    user: null,
  },
  reducers: {
    userLogin: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearState: () => ({
      token: "",
      user: null,
    }),
  },
});

export const { userLogin, clearState } = UserSlice.actions;
export default UserSlice.reducer;
