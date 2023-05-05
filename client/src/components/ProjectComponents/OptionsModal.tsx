import React, { Fragment, useState } from 'react';
//AppComponents
import { Info } from '../Popups'
//OtherComponents
import { Menu, Transition } from '@headlessui/react'
//Icons
import { IconContext } from "react-icons";
import { RxDotsHorizontal, } from 'react-icons/rx';
import { CiTrash } from 'react-icons/ci';


export default function OptionsModal(props) {

    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const deleteProject = () => {
        setOpenDeleteModal(true)
        props.deleteProject()
    }

    const closeDeleteModule = () => {
        setOpenDeleteModal(false)
        props.setLoadNewData(true)
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex w-full justify-center focus:outline-none">
                <IconContext.Provider value={{ color: 'black', size: '20' }}>
                    <RxDotsHorizontal />
                </IconContext.Provider>
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className={`absolute right-2 z-10 w-28 origin-top-right divide-y divide-gray-100 rounded-xl bg-white/20 backdrop-blur shadow-sm ring-1 px-1 py-1 ring-black ring-opacity-5 focus:outline-none`} >
                    <div className={`flex flex-col w-full h-full text-md `}>

                        <Info button={<button className='w-full h-full flex justify-between items-center py-1 my-1 rounded-md text-black' onClick={deleteProject}>
                            <span className='font-ubuntu'>
                                Delete
                            </span>
                            <div>
                                <IconContext.Provider value={{ color: 'black', size: '16' }}>
                                    <CiTrash />
                                </IconContext.Provider>
                            </div>
                        </button>}

                            isOpen={openDeleteModal}
                            onClose={closeDeleteModule} title={<span>Project <b> {props.projectTitle} </b> Deleted </span>} description={undefined} />
                    </div>

                </Menu.Items>
            </Transition>
        </Menu >
    )
}