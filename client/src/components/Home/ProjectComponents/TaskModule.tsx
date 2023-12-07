/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tab } from '@headlessui/react'
import { convertHexToRGBA } from '../../utils'
import UseAnimations from 'react-useanimations'
import radioButton from 'react-useanimations/lib/radioButton'
import { PlusIcon } from '@heroicons/react/24/outline'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function TaskModule({ tasks, completedTasks, accentColor }: { tasks: Array<string>, completedTasks: Array<string>, accentColor: string }) {
    return (
        <div className="w-full h-[500px]">
            <Tab.Group>
                <Tab.List className={`flex space-x-2 rounded-xl p-1 h-[10%]`} style={{ background: convertHexToRGBA(accentColor, 0.2) }}>
                    {
                        tasks.map((task: string) => (
                            <Tab
                                key={task}
                                className={({ selected }) =>
                                    classNames(
                                        `rounded-lg py-2.5 w-[100px] text-sm font-medium leading-5 ${completedTasks.includes(task) ? 'text-green-400' : 'text-blue-700'}`,
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
                    <button
                        className={
                            classNames(
                                `flex justify-center w-[50px] items-center hover:bg-white/20 rounded-lg`,
                                'focus:outline-none',
                            )
                        }
                    >
                        <PlusIcon width={20} color={'gray'} />
                    </button>
                </Tab.List>
                <Tab.Panels className="mt-2 bg-red-0 h-[85%]">
                    {tasks.map((task, idx) => (
                        <Tab.Panel
                            key={idx}
                            className={classNames(
                                'rounded-xl bg-cyan-400/20 h-full text-black p-3 flex justify-between',
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
