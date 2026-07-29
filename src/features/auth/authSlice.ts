
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { SessionResponse, SessionUser } from "@/lib/type/authType";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthState = {
    user: SessionUser | null;
    accessToken: string | null;
    expiresAt: number | null;
    status: AuthStatus;
};

const initialState: AuthState = {
    user: null,
    accessToken: null,
    expiresAt: null,
    status: "loading",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        sessionLoaded(state, action: PayloadAction<SessionResponse>) {
            const { authenticated, user, accessToken, expiresAt } = action.payload;
            state.user = authenticated ? user : null;
            state.accessToken = authenticated ? accessToken : null;
            state.expiresAt = authenticated ? expiresAt : null;
            state.status = authenticated ? "authenticated" : "unauthenticated";
        },

        profileLoaded(state, action: PayloadAction<Partial<SessionUser>>) {
            if (!state.user) return;
            state.user = { ...state.user, ...action.payload };
        },

        signedOut(state) {
            state.user = null;
            state.accessToken = null;
            state.expiresAt = null;
            state.status = "unauthenticated";
        },
    },
});

export const { sessionLoaded, profileLoaded, signedOut } = authSlice.actions;
export default authSlice.reducer;

type WithAuth = { auth: AuthState };

export const selectAuth = (state: WithAuth) => state.auth;
export const selectUser = (state: WithAuth) => state.auth.user;
export const selectAccessToken = (state: WithAuth) => state.auth.accessToken;
export const selectIsAuthenticated = (state: WithAuth) =>
    state.auth.status === "authenticated";
export const selectAuthStatus = (state: WithAuth) => state.auth.status;