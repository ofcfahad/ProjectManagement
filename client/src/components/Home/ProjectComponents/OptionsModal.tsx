/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from 'react';
//AppComponents
import { Info } from '../../Popups'
//OtherComponents
import { Menu, Transition } from '@headlessui/react'
//Icons
import { IconContext } from "react-icons";
import { RxDotsHorizontal, } from 'react-icons/rx';
import { CiCircleChevLeft, CiEdit, CiTrash } from 'react-icons/ci';
import { useUserData } from '../../Contexts/User/useUserDataContext';
import { useThemeContext } from '../../Contexts/Theme/useThemeContext';
import { Popconfirm, message } from 'antd';
import { AiTwotoneDelete } from 'react-icons/ai';


export default function OptionsModal(props: any) {

    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [buttonHovering, setButtonHovering] = useState('')

    const { theme } = useThemeContext()
    const { userData } = useUserData()

    const confirm = () =>
        new Promise((resolve) => {
            setTimeout(() => {
                console.log('promise resolved');
                resolve(null)
            }, 5000);
        });

    const xconfirm = (e?: React.MouseEvent<HTMLElement>) => {
        console.log(e);
        message.success('Project Deleted');
    };

    const cancel = (e?: React.MouseEvent<HTMLElement>) => {
        console.log(e);
        message.error('Click on No');
    };

    const deleteProject = () => {
        props.deleteProject()
        setOpenDeleteModal(true)
    }

    const leaveProject = () => {
        // to-do
        console.log('leaves');
    }

    const closeDeleteModule = () => {
        setOpenDeleteModal(false)
        props.loadNewData()
    }

    const handleEditClick = () => {
        props.openModal()
        props.setEditMode(true)
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex w-full justify-center focus:outline-none">
                <IconContext.Provider value={{ color: 'gray', size: '20' }}>
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
                <Menu.Items className={`absolute right-2 z-10 w-28 origin-top-right divide-y divide-gray-100 rounded-xl bg-white/20 backdrop-blur shadow-sm ring-1 px-1 py-1 ring-black ring-opacity-5 focus:outline-none`}>
                    <div className={`flex flex-col w-full h-full text-md `}>

                        {
                            props.owner === userData._id ?
                                <div>
                                    <Popconfirm
                                        title="Delete the Project"
                                        description="Are you sure to delete this Project?"
                                        onConfirm={confirm}
                                        onCancel={cancel}
                                        icon={
                                            <IconContext.Provider value={{ color: 'red', size: '20' }}>
                                                <AiTwotoneDelete />
                                            </IconContext.Provider>
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button className='w-full h-full flex justify-between items-center py-1 my-1 rounded-md text-black' onMouseOver={() => setButtonHovering('trash')} onMouseOut={() => setButtonHovering('')}>
                                            <span className={`font-ubuntu text-sm ${buttonHovering == 'trash' ? 'text-red-500' : 'text-black'}`}>
                                                Trash
                                            </span>
                                            <div>
                                                <IconContext.Provider value={{ color: buttonHovering == 'trash' ? 'red' : 'black', size: '18' }}>
                                                    <CiTrash />
                                                </IconContext.Provider>
                                            </div>
                                        </button>
                                    </Popconfirm>

                                    {/* <Info button={<button className='w-full h-full flex justify-between items-center py-1 my-1 rounded-md text-black' onMouseOver={() => setButtonHovering('trash')} onMouseOut={() => setButtonHovering('')} onClick={deleteProject}>
                                        <span className={`font-ubuntu text-sm ${buttonHovering == 'trash' ? 'text-red-500' : 'text-black'}`}>
                                            Trash
                                        </span>
                                        <div>
                                            <IconContext.Provider value={{ color: buttonHovering == 'trash' ? 'red' : 'black', size: '18' }}>
                                                <CiTrash />
                                            </IconContext.Provider>
                                        </div>
                                    </button>}

                                        isOpen={openDeleteModal}
                                        onClose={closeDeleteModule} title={<div className={` ${theme === 'dark' ? 'text-white' : 'text-black'} `} >{<div>Project <b> {props.projectTitle} </b> Deleted </div>} </div>} description={''} /> */}

                                    <button className='w-full h-full flex justify-between items-center py-1 my-1 rounded-md text-black' onMouseOver={() => setButtonHovering('edit')} onMouseOut={() => setButtonHovering('')} onClick={handleEditClick}>
                                        <span className={`font-ubuntu text-sm ${buttonHovering == 'edit' ? 'text-cyan-500' : 'text-black'}`}>
                                            Edit
                                        </span>
                                        <div>
                                            <IconContext.Provider value={{ color: buttonHovering == 'edit' ? 'skyblue' : 'black', size: '18' }}>
                                                <CiEdit />
                                            </IconContext.Provider>
                                        </div>
                                    </button>
                                </div>
                                :
                                <Info button={<button className='w-full h-full flex justify-between items-center py-1 my-1 rounded-md text-black' onMouseOver={() => setButtonHovering('leave')} onMouseOut={() => setButtonHovering('')} onClick={leaveProject}>
                                    <span className={`font-ubuntu text-sm ${buttonHovering == 'leave' ? 'text-orange-300' : 'text-black'}`}>
                                        Leave
                                    </span>
                                    <div>
                                        <IconContext.Provider value={{ color: buttonHovering == 'leave' ? 'orange' : 'black', size: '20' }}>
                                            <CiCircleChevLeft />
                                        </IconContext.Provider>
                                    </div>
                                </button>}

                                    isOpen={openDeleteModal}
                                    onClose={closeDeleteModule} title={<div className={` ${theme === 'dark' ? 'text-white' : 'text-black'} `} >{<div>Left Project <b> {props.projectTitle} </b> </div>} </div>} description={''} />
                        }

                    </div>

                </Menu.Items>
            </Transition>
        </Menu >
    )
}