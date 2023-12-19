import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useUserData, useTheme } from './Contexts'
import { profilePicture } from '../assets'
import { themeColors } from './utils'
import { UserPlusIcon } from '@heroicons/react/24/outline'

export default function UserProfiles() {
    const { getUserData } = useUserData()
    const userData = getUserData()

    const people = [
        {
            id: userData._id,
            name: userData.fullName || userData.userName,
            profilePicture: userData.userProfilePicture,
        },
    ]

    const [selected, setSelected] = useState(people[0])

    const { theme } = useTheme()
    const color = themeColors(theme, 'main')
    const bgColor = themeColors(theme, 'background')

    return (
        <div className="w-[200px]">
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <Listbox.Button className={`relative flex items-center justify-between w-full p-2 rounded-lg hover:${bgColor} hover:shadow-md focus:outline-none`}>
                        <div className='flex items-center gap-2'>
                            <img src={selected.profilePicture || profilePicture} className=" h-10 w-10 rounded-full" />
                            <span className="text-sm" style={{ color: color }}> {selected.name} </span>
                        </div>
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400 flex justify-end float-right"
                            aria-hidden="true"
                        />
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md p-0 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {
                                people.map((person, personIdx) => (
                                    <Listbox.Option
                                        hidden={person.id === userData._id}
                                        key={personIdx}
                                        className={({ active }) =>
                                            `relative cursor-pointer font-ubuntu select-none p-2 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({ selected }) => (
                                            <span
                                                className={`truncate flex items-center gap-2 ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                <img src={person.profilePicture || profilePicture} className=" h-10 w-10 rounded-full" />
                                                <span className="text-sm" style={{ color: color }}> {person.name} </span>
                                            </span>

                                        )}
                                    </Listbox.Option>
                                ))}

                            <Listbox.Button
                                className="relative cursor-pointer w-full font-ubuntu select-none p-2 text-gray-900"
                            >
                                {
                                    <span
                                        className={`truncate p-2 w-full flex items-center justify-between gap-2}`}
                                    >
                                        <span className='text-[15px]'>
                                            Add an Account
                                        </span>
                                        <UserPlusIcon className={`h-5 w-5 text-black`} />
                                    </span>
                                }
                            </Listbox.Button>
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox >
        </div >
    )
}