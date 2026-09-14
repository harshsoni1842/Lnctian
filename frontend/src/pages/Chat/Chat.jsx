import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import ChatBox from '../../components/ChatBox/ChatBox'
import RightSidebar from '../../components/RightSidebar/RightSidebar'
// import { AppContext } from '../../context/AppContext'

const Chat = () => {

  const [selectedUser, setSelectedUser] = useState(false)
  // const { chatData,userData } = useContext(AppContext);
  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   if (chatData && userData) {
  //     setLoading(false);
  //   }
  // }, [chatData,userData])

  return (
    <div className='chat'>
      {/* {loading
        ?<p className='loading'>
          Loading...
        </p> */}
        {/* :  */}
        <div className="chat-container">
          <LeftSidebar />
          <ChatBox />
          {/* <RightSidebar /> */}
          {/* <ChatBox selectedUser={selectedUser} setSelectedUser={setSelectedUser} /> */}
          {/* <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} /> */}
        </div>
      {/* } */}

    </div>
  )
}

export default Chat
