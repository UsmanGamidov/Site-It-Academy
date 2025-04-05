import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchUserData = createAsyncThunk('fetchUserData', async (params) => {
    const { data } = await axios.post('/login', params)
    return data
})

const initialState = {
    data: null,
    status: 'loading',

}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.status = 'loading';
                state.data = null;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.status = 'error';
                state.data = null;
                state.error = action.payload;
            });
    }
})


export const authReducer = authSlice.reducer