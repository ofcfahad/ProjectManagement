import { useEffect, useState } from "react";
// App Components
import ProfileModule from "../components/Messages/ProfileModule"
import SearchBar from "../components/Messages/SearchBar";
import Chat from "../components/Messages/Chat";
import CreateChat from "../components/Messages/CreateChat";
import NoChats from '../components/Messages/NoChats'
import { MenuButton } from "../components"
import { Chat as ChatType } from "../components/Interfaces";
import { useApi, useChats, useTheme, useUserData } from "../components/Contexts";
import { themeColors } from "../components/utils";
// Other Components
import { Tab } from "@headlessui/react";
// Assets
import { chat } from "../assets";
import { getSocket } from "../components/Messages/socket";

const Messages = () => {

  const { getChats } = useChats()

  const [chats, setChats] = useState<ChatType[]>(getChats())
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { getUserData } = useUserData()
  const userData = getUserData()

  const { createChat } = useApi()

  const { theme } = useTheme()
  const color = themeColors(theme, 'main')
  const bgColor = themeColors(theme, 'background')

  const addNewChat = async (recipient: string) => {
    if (!recipient) {
      return
    }
    const data = await createChat([recipient])
    setChats([...chats, data])
    // selects the newly created chat
    setSelectedIndex(chats.length - 1)
  }

  useEffect(() => {

    const socket = getSocket()

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.connect()

    return () => {
      socket.disconnect()
    };
  }, []);

  return (
    <div className={`w-full h-full`}>

      {/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: window.scrollY == 0 ? 1 : 0 }} className='h-[10%] sticky flex flex-col justify-center items-center'>
        <TopBar />
      </motion.div> */}

      <div className="w-full h-full">
        <Tab.Group vertical selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className={`w-full h-full flex`}>

            {/* People */}
            <div className={`${bgColor} w-[20%] h-full`}>

              <div className="flex flex-col h-[15%] pt-[35px] px-2 w-full">

                <div className="flex justify-between">

                  <div className="flex">
                    <MenuButton />
                    <span className={`text-3xl text-${color} font-alkatra ml-2`}>Messages</span>
                  </div>

                  <CreateChat addNewChat={addNewChat} />

                </div>

                <div className="h-[40px] mt-3">
                  <SearchBar />
                </div>

              </div>

              <div className={` ${theme === 'dark' ? 'bg-gray-700' : 'bg-[#f5f5f5]'} h-[1px] mx-2 rounded-full`} />

              {/* Profiles */}
              <div className="h-[84%] w-full">

                {
                  chats != null && chats.length > 0 ? chats.map((chat: ChatType) => (
                    <Tab key={chat._id} className="focus:outline-none w-full">
                      {
                        ({ selected }) => {

                          const recipient = chat.participants[0].userName == userData.userName ? chat.participants[1] : chat.participants[0]

                          return (
                            <div>
                              <ProfileModule profile={recipient} selected={selected} />
                              {
                                chat._id !== chats[chats.length - 1]._id &&
                                <div className={`bg-[#f5f5f5] h-[1px] w-full rounded-full`} />
                              }
                            </div>
                          )
                        }
                      }
                    </Tab>
                  ))
                    :
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <img src={chat} alt="chat-illustration" />
                      <span className={`text-${color} font-alkatra`}>No Chats Started Yet</span>
                    </div>
                }

              </div>

            </div>

            {/* Chats */}
            <div className='w-[80%] bg-transparent flex justify-center items-center font-oswald'>
              <Tab.Panels className={`w-full h-full`}>
                {
                  chats != null && chats.length > 0 ?
                    chats.map((chat: ChatType) => (
                      <Tab.Panel key={chat._id} className={`w-full h-full`}>
                        <Chat chat={chat} />
                      </Tab.Panel>
                    ))
                    :
                    <NoChats />
                }
              </Tab.Panels>
            </div>

          </Tab.List>
        </Tab.Group>

      </div>


    </div >
  )
}

export default Messages