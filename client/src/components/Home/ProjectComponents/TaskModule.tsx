/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { convertHexToRGBA } from '../../functions'
import UseAnimations from 'react-useanimations'
import radioButton from 'react-useanimations/lib/radioButton'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function TaskModule({ tasks, completedTasks, accentColor }: { tasks: Array<string>, completedTasks: Array<string>, accentColor: string }) {
    const [categories] = useState({
        Recent: [
            {
                id: 1,
                title: 'Does drinking coffee make you smarter?',
                date: '5h ago',
                commentCount: 5,
                shareCount: 2,
            },
            {
                id: 2,
                title: "So you've bought coffee... now what?",
                date: '2h ago',
                commentCount: 3,
                shareCount: 2,
            },
        ],
        Popular: [
            {
                id: 1,
                title: 'Is tech making coffee better or worse?',
                date: 'Jan 7',
                commentCount: 29,
                shareCount: 16,
            },
            {
                id: 2,
                title: 'The most innovative things happening in coffee',
                date: 'Mar 19',
                commentCount: 24,
                shareCount: 12,
            },
        ],
        Trending: [
            {
                id: 1,
                title: 'Ask Me Anything: 10 answers to your questions about coffee',
                date: '2d ago',
                commentCount: 9,
                shareCount: 5,
            },
            {
                id: 2,
                title: "The worst advice we've ever heard about coffee",
                date: '4d ago',
                commentCount: 1,
                shareCount: 2,
            },
        ],
    })

    return (
        <div className="w-full max-w-md px-2 py-16 sm:px-0">
            <Tab.Group>
                <Tab.List className={`flex space-x-1 rounded-xl p-1`} style={{ background: convertHexToRGBA(accentColor, 0.2) }}>
                    {
                        tasks.map((task: string) => (
                            <Tab
                                key={task}
                                className={({ selected }) =>
                                    classNames(
                                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${completedTasks.includes(task) ? 'text-green-400' : 'text-blue-700'}`,
                                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white shadow'
                                            : `text-blue-100 ${completedTasks.includes(task) ? 'hover:bg-green-200/20' : 'hover:bg-white/[0.12]'} hover:text-white`
                                    )
                                }
                            >
                                {task}
                            </Tab>
                        ))
                    }
                </Tab.List>
                <Tab.Panels className="mt-2">
                    {tasks.map((task, idx) => (
                        <Tab.Panel
                            key={idx}
                            className={classNames(
                                'rounded-xl bg-cyan-400/20 text-black p-3 flex justify-between',
                                'focus:outline-none'
                            )}
                        >
                            {task}
                            <UseAnimations animation={radioButton} reverse={completedTasks.includes(task)} />
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}
