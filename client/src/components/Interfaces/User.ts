/* eslint-disable @typescript-eslint/no-explicit-any */

export interface User {
    _id: any,
    userName: string,
    fullName: string,
    userEmail: string,
    userProfilePicture: string,
    userGithubLink: string,
    preferences: {
        theme: string,
        toolTipisVisible: boolean
    }
}

export interface UserSettings {
    theme: string
}