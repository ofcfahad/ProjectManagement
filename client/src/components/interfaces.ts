/* eslint-disable @typescript-eslint/no-explicit-any */

interface Project {
    title: string,
    description: string,
    accentColor: string,
    tasks: Array<string>,
    completedtasks: Array<string>,
    progress: number,
    people: Array<string>,
    owner: string,
    Dates: object,
    attachments: number,
    comments: number
}

interface User {
    _id: any,
    userName: string,
    fullName: string,
    userEmail: string,
    userProfilePicture: string,
    userGithubLink: string,
}

interface People {
    _id: any,
    userName: string,
    fullName: string,
    userProfilePicture: string,
    userGithubLink: string
}

interface UserSettings {
    theme: string
}

export type {
    Project,
    User,
    People,
    UserSettings
}