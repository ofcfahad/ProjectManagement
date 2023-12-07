import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useUserData, useTheme } from './Contexts'
import { profilePicture } from '../assets'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { themeColors } from './utils'

const people = [
    { name: 'Wade Cooper', profilePicture },
    { name: 'Arlene Mccoy', profilePicture },
    { name: 'Devon Webb', profilePicture },
    { name: 'Tom Cook', profilePicture },
    { name: 'Tanya Fox', profilePicture },
    { name: 'Hellen Schmidt', profilePicture },
]

export default function UserProfiles() {
    const [selected, setSelected] = useState(people[0])

    const { theme } = useTheme()
    const color = themeColors(theme, 'main')

    const { getUserData } = useUserData()
    const userData = getUserData()

    return (
        <div className="w-[200px]">
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <Listbox.Button className="relative flex items-center justify-between w-full p-2  rounded-lg hover:bg-white hover:shadow-md focus:outline-none">
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
                            {people.map((person, personIdx) => (
                                <Listbox.Option
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
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}