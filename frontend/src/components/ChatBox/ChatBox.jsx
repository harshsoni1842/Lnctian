import React, { useContext, useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { Await } from 'react-router-dom';
import toast from 'react-hot-toast';



const ChatBox = () => {
    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext);
    const { authUser, onlineUsers } = useContext(AuthContext);

    const scrollEnd = useRef()
    const [input, setInput] = useState('');

    // Handle sending a message
    const handleSendMessage = async (e) => {
      e.preventDefault();

      console.log("input value:", input)
      if(!input || input.trim() === "") return null;
      await sendMessage({text: input.trim()});
      setInput("")
    }

    // Handle sending an image
    const handleSendImage = async (e) =>{
      const file = e.target.files[0];
      if(!file || !file.type.startsWith("image/")){
        toast.error("select an image file")
        return ;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        await sendMessage({image: reader.result})
        e.target.value = ""
      }
      reader.readAsDataURL(file)
    }

const convertTimestamp = (timestamp) => {
  if(!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

    useEffect(() =>{
      if(selectedUser){
        getMessages(selectedUser._id)
      }
    },[selectedUser])

    useEffect(() =>{
      if(scrollEnd.current){
        scrollEnd.current.scrollIntoView({behavior: "smooth"})
      }
    }, [messages])
  return selectedUser ? (
    <div className= 'chat-box' >
      {/* ---------------header------------- */}
       <div className="chat-user">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" />
        <p>{selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <img className='dot' src={assets.green_dot} alt='' />}
          {/* dot class ki css nhi h or video me span function use h */}
          {/* <span className='status-badge-online' /> */}
        </p>
        <img onClick={()=>setSelectedUser(null)} className='arrow' src={assets.arrow_icon} alt="" />
        <img className='help' src={assets.help_icon} alt="" />
       </div>

       {/* ----------- chat Area ------- */}
       <div className="chat-msg">
         {Array.isArray(messages) && messages.length > 0 ? (
           messages.map((msg, index) => {
             return (
               <div key={index} className={msg.senderId === authUser._id ? "s-msg" : "r-msg"}>
                {msg["image"]
                  ? <img className='msg-img' src={msg["image"]} alt="" />
                  : <p className="msg">{msg["text"]}</p>
                }
                <div>
                  <img src={msg.senderId === authUser._id ? authUser.profilePic :
                     selectedUser.profilePic || assets.avatar_icon} alt="" />
                  <p>{convertTimestamp(msg.createdAt)}</p>
                </div>
              </div>
            )
          })
        ) : (
          <p className="no-msg-text">No messages yet. Say hi!</p>
        )
      }
      <div ref={scrollEnd}></div>
      </div>
         {/* ----bottom area--- */}
       <div className="chat-input">
      
         <input onChange={(e) => setInput(e.target.value)} value={input}
         onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
          type="text" placeholder='Send a message' />

         <input onChange={handleSendMessage} type="file" id='image' accept="image/png, image/jpeg" hidden />
         <label htmlFor="image">
           <img src={assets.gallery_icon} alt="" />
         </label>
         <img onClick={handleSendMessage} src={assets.send_button} alt="" />
       </div>
    </div>
    
  ): <div className={`chat-welcome`}>
    {/* <* className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>*/}
    <img src={assets.logo_icon} alt=''/>
     <p>Chat anytime, anywhere</p>
   </div>
}

export default ChatBox






// const ChatBox = () => {

  
//   const { userData, messagesenderId, chatUser,messages,setMessages, chatVisible, setChatVisible } = useContext(AppContext);
//   const [input, setInput] = useState("");
//   const scrollEnd = useRef();

//   const sendMessage = async () => {

//     try {

//       if (input && messagesenderId) {
//         await updateDoc(doc(db, "messages", messagesenderId), {
//           messages: arrayUnion({
//             senderId: userData.id,
//             text: input,
//             createdAt: new Date()
//           })
//         })

//         const userIDs = [chatUser.rId, userData.id];

//         userIDs.forEach(async (id) => {
//           const userChatsRef = doc(db, "chats", id);
//           const userChatsSnapshot = await getDoc(userChatsRef);

//           if (userChatsSnapshot.exists()) {
//             const userChatsData = userChatsSnapshot.data();
//             const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === messagesenderId);
//             userChatsData.chatsData[chatIndex].lastMessage = input;
//             userChatsData.chatsData[chatIndex].updatedAt = Date.now();
//             if (userChatsData.chatsData[chatIndex].rId == userData.id) {
//               userChatsData.chatsData[chatIndex].messageSeen = false;
//             }
//             await updateDoc(userChatsRef, {
//               chatsData: userChatsData.chatsData,
//             });
//           }
//         })
//       }

//     } catch (error) {
//       toast.error(error.message)
//     }

//     setInput("")

//   }

//   const convertTimestamp = (timestamp) => {
//     let date = timestamp.toDate();
//     const hour = date.getHours();
//     const minute = date.getMinutes();
//     if (hour > 12) {
//       date = hour - 12 + ':' + minute + " PM";
//     }
//     else {
//       date = hour + ':' + minute + " AM";
//     }
//     return date;
//   }

//   const sendImage = async (e) => {

//     const fileUrl = await upload(e.target.files[0])

//     if (fileUrl && messagesId) {
//       await updateDoc(doc(db, "messages", messagesId), {
//         messages: arrayUnion({
//           sId: userData.id,
//           image: fileUrl,
//           createdAt: new Date()
//         })
//       })

//       const userIDs = [chatUser.rId, userData.id];

//       userIDs.forEach(async (id) => {
//         const userChatsRef = doc(db, "chats", id);
//         const userChatsSnapshot = await getDoc(userChatsRef);

//         if (userChatsSnapshot.exists()) {
//           const userChatsData = userChatsSnapshot.data();
//           const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === messagesId);
//           userChatsData.chatsData[chatIndex].lastMessage = "Image";
//           userChatsData.chatsData[chatIndex].updatedAt = Date.now();
//           await updateDoc(userChatsRef, {
//             chatsData: userChatsData.chatsData,
//           });
//         }
//       })
//     }
//   }


//   useEffect(() => {
//     scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages])

//   useEffect(() => {
//     if (messagesId) {
//       const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
//         setMessages(res.data().messages.reverse());
//       });
//       return () => {
//         unSub();
//       };
//     }

//   }, [messagesId]);

//   return chatUser ? (
//     <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
//       <div className="chat-user">
//         <img src={chatUser ? chatUser.userData.avatar : assets.profile_img} alt="" />
//         <p>{chatUser ? chatUser.userData.name : "Richard Sanford"} {Date.now() - chatUser.userData.lastSeen <= 70000 ?
//       <img className='dot' src={assets.green_dot} alt='' /> : null}</p>
//         <img onClick={()=>setChatVisible(false)} className='arrow' src={assets.arrow_icon} alt="" />
//         <img className='help' src={assets.help_icon} alt="" />
//       </div>
//       <div className="chat-msg">
//         <div ref={scrollEnd}></div>
//         {
//           messages.map((msg, index) => {
//             return (
//               <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
//                 {msg["image"]
//                   ? <img className='msg-img' src={msg["image"]} alt="" />
//                   : <p className="msg">{msg["text"]}</p>
//                 }
//                 <div>
//                   <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
//                   <p>{convertTimestamp(msg.createdAt)}</p>
//                 </div>
//               </div>
//             )
//           })
//         }
//       </div>
//       <div className="chat-input">
//         <input onKeyDown={(e) => e.key === "Enter" ? sendMessage() : null} onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
//         <input onChange={sendImage} type="file" id='image' accept="image/png, image/jpeg" hidden />
//         <label htmlFor="image">
//           <img src={assets.gallery_icon} alt="" />
//         </label>
//         <img onClick={sendMessage} src={assets.send_button} alt="" />
//       </div>
//     </div>
//   ) : <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
//     <img src={assets.logo_icon} alt=''/>
//     <p>Chat anytime, anywhere</p>
//   </div>
// }

// export default ChatBox
