/* eslint-disable @typescript-eslint/no-explicit-any */
import { Person } from "."

export interface Project {
    _id: any,
    title: string,
    description: string,
    accentColor: string,
    tasks: Array<string>,
    completedtasks: Array<string>,
    progress: number,
    people: Array<Person>,
    owner: Person,
    Dates: {
        created: Date,
        updated?: Date
    },
    attachments: number,
    comments: number
}