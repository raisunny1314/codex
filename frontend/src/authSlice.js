import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";


// const extractError = (error) => {
//     return {
//         message: error.response?.data?.message || error.message || "Something went wrong",
//         status: error.response?.status,
//         data: error.response?.data,
//     };
// };


export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/user/register", userData);
            return response.data.user;

        } catch (error) {
        //    return rejectWithValue(extractError(error));
           return rejectWithValue(error);
        }


    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/user/login", credentials);
            return response.data.user;

        } catch (err) {
            // return rejectWithValue(extractError(err));
           return rejectWithValue(err);

        }


    }
);
export const checkAuth = createAsyncThunk(
    "auth/check",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.get("/user/check");
            return data.user;

        } catch (err) {
            // return rejectWithValue(extractError(err));
           return rejectWithValue(err);

        }


    }
);
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {

            await axiosClient.post("/user/logout");
            return null;

        } catch (err) {
        //    return rejectWithValue(extractError(err));
           return rejectWithValue(err);

        }


    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
    }, reducers: {

    },
    extraReducers: (builder) => {
        builder
            //register user case
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;//khali object aya toh false mark hoga
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went Wrong";
                state.isAuthenticated = false;
                state.user = null;
            })

            //login user case
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;//khali object aya toh false mark hoga
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went Wrong";
                state.isAuthenticated = false;
                state.user = null;
            })

            //checkAuth user case
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;//khali object aya toh false mark hoga
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went Wrong";
                state.isAuthenticated = false;
                state.user = null;
            })

            //logout   user case
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;//khali object aya toh false mark hoga
                state.user = action.payload;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went Wrong";
                state.isAuthenticated = false;
                state.user = null;
            });
    }

});

export default authSlice.reducer;