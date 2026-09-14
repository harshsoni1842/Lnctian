import React, { useContext, useEffect, useState } from 'react'
import './LeftSidebar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const LeftSidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages } = useContext(ChatContext);

    const { logout, onlineUsers } = useContext(AuthContext)

    const [input, setInput] = useState(false);
    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().
        includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers])
    return (
        <div className="ls">
            <div className="ls-top">
                <div className="ls-nav">
                    <img className='logo' src={assets.logo} alt="" />
                    <div className='menu'>
                        <img src={assets.menu_icon} alt="" />
                        <div className='sub-menu'>
                            <p onClick={() => navigate('/profile')}>Edit Profile</p>
                            <hr />
                            <p onClick={() => logout()}>Log out</p>
                        </div>
                    </div>
                </div>
                <div className="ls-search">
                    <img src={assets.search_icon} alt="Search" />
                    <input onChange={(e) => setInput(e.target.value)} type="text" placeholder='Search here..' />
                </div>
            </div>
            <div className="user-list-container">
                {filteredUsers.map((user) => {
                    const isSelected = selectedUser?._id === user._id;
                    const isOnline = onlineUsers.includes(user._id);
                    const unseenCount = unseenMessages[user._id] || 0;

                    return (
                        <div
                            key={user._id}
                            onClick={() => {
                                setSelectedUser(user);
                                setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
                            }}
                            className={`user-card ${isSelected ? "selected" : ""}`}
                        >
                            <div className="avatar-wrapper">
                                <img
                                    src={user?.profilePic || assets.avatar_icon}
                                    alt=""
                                    className="avatar-img"
                                />
                                <span className={`status-badge ${isOnline ? "online" : "offline"}`} />
                            </div>

                            <div className="user-details">
                                <p className="user-name">{user.fullName}</p>
                                <span className={`status-text ${isOnline ? "online" : "offline"}`}>
                                    {isOnline ? "Online" : "Offline"}
                                </span>
                            </div>

                            {unseenCount > 0 && (
                                <span className="unseen-badge">
                                    {unseenCount > 99 ? "99+" : unseenCount}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div >
    )
}

export default LeftSidebar


//css code
{/* <div className = 'flex flex-col'>
    {filteredUsers.map((user, index)=>(
        <div onClick ={()=>{setSelectedUser(user)}}
        key={index} className={`relative flex items-center gap-2 p-2 pl-4
            rounded cursor-pointer max-sm ${selectedUser?._id === user.
                _id && 'bg[#282142]/50'}`}>
                    <img src={user?.profilePic || assets.avatar_icon} alt=""
                    className='w-[35px] aspect-[1/1] rounded-full'/>
                    <div className='flex flex-col leading-5'>
                        <p>{user.fullName}</p>
                        {
                            onlineUsers.includes(user._id)
                            ? <span className='text-green-400 text-xs'>Online</span> 
                            : <span className='text-neutral-400 text-xs'>Offline</span> 
                        }
                    </div>
                    {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5
                    flex justify-center items-center rounded-full bg-violet-500/50'>
                    {unseenMessages[user._id]}</p>}
        </div>
    ))}
</div> */}














// const LeftSidebar = () => {
//     const { chatData, userData, chatUser, setChatUser, setMessagesId, messagesId, chatVisible, setChatVisible } = useContext(AppContext);
//     const [user null);
//     const [showSearch, setS false)
//     const navigate = useNavigate();

//     const inputHandler = async (e) => {

//         try {
//             const input = e.target.value;

//             if (input) {
//                 setShowSearch(true);
//                 const userRef = collection(db, "users");
//                 const q = query(userRef, where("username", "==", input.toLowerCase()));
//                 const querySnap = await getDocs(q);
//                 if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
//                     let userExist = false;
//                     chatData.map((user) => {
//                         if (user.rId === querySnap.docs[0].data().id) {
//                             userExist = true;
//                         }
//                     })
//                     if (!userExist) {
//                         setUser(querySnap.docs[0].data());
//                     }
//                 }
//                 else {
//                     setUser(null)
//                 }
//             }
//             else {
//                 setShowSearch(false);
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     const addChat = async () => {
//         const messagesRef = collection(db, "messages");
//         const chatsRef = collection(db, "chats");
//         try {
//             if (user.id === userData.id) {
//                 return 0
//             }
//             const newMessageRef = doc(messagesRef);

//             await setDoc(newMessageRef, {
//                 createAt: serverTimestamp(),
//                 messages: []
//             })

//             await updateDoc(doc(chatsRef, user.id), {
//                 chatsData: arrayUnion({
//                     messageId: newMessageRef.id,
//                     lastMessage: "",
//                     rId: userData.id,
//                     updatedAt: Date.now(),
//                     messageSeen: true
//                 }),
//             });

//             await updateDoc(doc(chatsRef, userData.id), {
//                 chatsData: arrayUnion({
//                     messageId: newMessageRef.id,
//                     lastMessage: "",
//                     rId: user.id,
//                     updatedAt: Date.now(),
//                     messageSeen: true
//                 }),
//             });

//             const uSnap = await getDoc(doc(db, "users", user.id));
//             const uData = uSnap.data();
//             setChat({
//                 messageId: newMessageRef.id,
//                 lastMessage: "",
//                 rId: user.id,
//                 updatedAt: Date.now(),
//                 messageSeen: true,
//                 userData: uData,
//             });
//             setShowSearch(false)
//             setChatVisible(true)
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     const setChat = async (item) => {
//         setMessagesId(item.messageId)
//         setChatUser(item)
//         const userChatsRef = doc(db, "chats", userData.id);
//         const userChatsSnapshot = await getDoc(userChatsRef);
//         const userChatsData = userChatsSnapshot.data();
//         const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
//         userChatsData.chatsData[chatIndex].messageSeen = true;
//         await updateDoc(userChatsRef, {
//             chatsData: userChatsData.chatsData,
//         });
//         setChatVisible(true)
//     }

//     useEffect(() => {
//         const updateChatUserData = async () => {
//             if (chatUser) {
//                 const userRef = doc(db, "users", chatUser.userData.id);
//                 const userSnap = await getDoc(userRef);
//                 const userData = userSnap.data();
//                 setChatUser(prev => ({ ...prev, userData: userData }))
//             }
//         }
//         updateChatUserData();
//     }, [chatData])


//     return (
//         <div className={`ls ${chatVisible ? "hidden" : ""}`}>
//             <div className='ls-top'>
//                 <div className='ls-nav'>
//                     <img className='logo' src={assets.logo} alt="" />
//                     <div className='menu'>
//                         <img src={assets.menu_icon} alt="" />
//                         <div className='sub-menu'>
//                             <p onClick={() => navigate('/profile')}>Edit Profile</p>
//                             <hr />
//                             <p onClick={() => logout()}>Logout</p>
//                         </div>
//                     </div>

//                 </div>
//                 {/* <div className="ls-search">
//                     <img src={assets.search_icon} alt="" />
//                     <input onChange={inputHandler} type="text" placeholder='Search here..' />
//                 </div> */}
//             </div>
//             <div className="ls-list">
//                 {showSearch && user
//                     ? <div onClick={addChat} className='friends add-user'>
//                         <img src={user.avatar} alt="" />
//                         <p>{user.name}</p>
//                     </div>
//                     : chatData.map((item, index) => (
//                         // <div onClick={() => setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}>
//                         //     <img src={item.userData.avatar} alt="" />
//                         <div>
//                             <p>{item.userData.name}</p>
//                             <span>{item.lastMessage.slice(0, 30)}</span>
//                         </div>
//                         // </div>
//                     ))}
//             </div>
//         </div>
//     )
// }

// export default LeftSidebar
