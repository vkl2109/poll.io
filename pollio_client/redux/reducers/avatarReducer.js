import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = {
    base64: ""
}

const userSlice = createSlice({
  name: "avatar",
  initialState: initialStateValue,
  reducers: {
    uploadAvatar: (state, action) => {
      state.value = action.payload
    },
    deleteAvatar: (state) => {
        state.value = initialStateValue
    }
  }
})

export const { uploadAvatar, deleteAvatar } = userSlice.actions
export default userSlice.reducer