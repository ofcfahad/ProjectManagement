/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Person {
    _id?: any,
    userName: string,
    fullName?: string,
    userEmail?: string,
    userProfilePicture: string,
    userGithubLink?: string,
    verified?: boolean
}