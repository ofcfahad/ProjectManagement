/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { Fragment } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { useThemeContext } from './Contexts/Theme/useThemeContext'

export function Info({ button, title, isOpen, onClose, description }: { button: any, title: any, isOpen: boolean, onClose: any, description: string }) {

    const { theme } = useThemeContext()

    return (
        <div>
            <div className="flex items-center justify-center">
                {button}
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`max-w-md transform overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-black'} p-6 text-left align-middle shadow-xl transition-all`}>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {title}
                                    </Dialog.Title>

                                    <Dialog.Description>
                                        {description}
                                    </Dialog.Description>

                                    <div className="mt-4 flex justify-center items-center">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={onClose}
                                        >
                                            Got it !
                                        </button>
                                    </div>
                                </Dialog.Panel>

                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </div>
    )
}

export function DeletedInfo({ isOpen, onClose, deletedProjects }: { isOpen: boolean, onClose: any, deletedProjects: Array<object> }) {

    const { theme } = useThemeContext()

    return (
        <div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`h-[300px] w-[500px] transform overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-black'} p-6 text-left align-middle shadow-xl transition-all`}>
                                    <Dialog.Title
                                        as="h3"
                                        className="flex justify-between text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Projects Deleted
                                        <button className='focus:outline-none' onClick={onClose} >
                                            <RxCross1 />
                                        </button>
                                    </Dialog.Title>

                                    <Dialog.Description>
                                        <Disclosure>
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-green-100 px-4 py-2 text-left text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none ">
                                                        <span>View Details</span>
                                                        <ChevronUpIcon
                                                            className={`${open ? '' : 'rotate-180 transform'
                                                                } h-5 w-5 text-green-500`}
                                                        />
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                        The Following Projects Were Deleted:
                                                        <ul>
                                                            {
                                                                deletedProjects.map((project: any) => (
                                                                    <li key={project.id}> <b>{project.title}</b> </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    </Dialog.Description>

                                </Dialog.Panel>

                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </div>
    )
}

export function Confirmation({ button, isOpen, onClose, title, description, customSubmitButton, customSubmitButtonTitle }: { button: any, isOpen: boolean, onClose: any, title: any, description: string, customSubmitButton: any, customSubmitButtonTitle: string }) {

    const { theme } = useThemeContext()

    return (
        <div>
            <div className="flex items-center justify-center">
                {button}
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`w-auto max-w-md transform overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-black'} p-6 text-left align-middle shadow-xl transition-all`}>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium flex justify-between items-center leading-6 text-gray-900"
                                    >
                                        <span>
                                            {title}
                                        </span>
                                        <button onClick={onClose}>
                                            <RxCross1 style={{ height: 15 }} />
                                        </button>
                                    </Dialog.Title>

                                    <Dialog.Description>
                                        {description}
                                    </Dialog.Description>

                                    <motion.div whileTap={{ scale: 0.9 }} className="mt-4 flex justify-center items-center ">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={customSubmitButton}
                                        >
                                            {customSubmitButtonTitle}
                                        </button>
                                    </motion.div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </div>
    )
}

export const UserProfileCompletion = ({ completeProfileDialogisOpen, setCompleteProfileDialogisOpen }: { completeProfileDialogisOpen: boolean, setCompleteProfileDialogisOpen: any }) => {

    const { theme } = useThemeContext()

    return (
        <Transition appear show={completeProfileDialogisOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setCompleteProfileDialogisOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 span-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-black'} p-6 span-left align-middle shadow-xl transition-all`}>
                                <div className='flex justify-between items-center'>
                                    <Dialog.Title
                                        as='h2'
                                        className="span-3xl "
                                    >
                                        Complete Your Profile
                                    </Dialog.Title>
                                    <button onClick={() => setCompleteProfileDialogisOpen(false)} >
                                        <RxCross1 style={{ color: 'red' }} />
                                    </button>
                                </div>

                                <div>
                                    <div className='flex flex-col'>
                                        <span>
                                            Your Name
                                        </span>
                                        <span className='flex mt-2 items-center w-full'>
                                            <input type="text" placeholder='here' className='flex justify-center w-1/2 border-black border rounded-md px-2 ' />
                                        </span>
                                    </div>
                                </div>

                                <div className='w-full flex items-center mt-4'>
                                    <div className='w-1/2 flex justify-between items-center'>
                                        <button className='btn btn-danger !text-xs'>
                                            don't ask again
                                        </button>
                                        <button className='btn btn-primary !text-xs'>
                                            Later
                                        </button>
                                    </div>
                                    <div className='w-1/2 flex justify-end'>
                                        <button className='btn btn-success !text-xs'>
                                            Go On
                                        </button>
                                    </div>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div >
            </Dialog >
        </Transition >
    )
}