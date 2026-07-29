

export type SessionUser = {
    id: string;
    username: string;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    roles: string[];
};

export type SessionResponse = {
    authenticated: boolean;
    user: SessionUser | null;
    accessToken: string | null;
    /** Unix epoch in milliseconds. */
    expiresAt: number | null;
};

export type UserProfileResponse = {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    role: string;
    address: string;
    profilePicture: string;
};