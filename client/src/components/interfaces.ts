/* eslint-disable @typescript-eslint/no-explicit-any */

interface Project {
    _id: any,
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

interface MinimalProject {
    id: any,
    title: string
}

interface User {
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
    MinimalProject,
    User,
    People,
    UserSettings
}