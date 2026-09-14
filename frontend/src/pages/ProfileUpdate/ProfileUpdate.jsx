import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { Await, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
// import { onAuthStateChanged } from 'firebase/auth';
// import upload from '../../lib/upload';
// import { toast } from 'react-toastify';



const ProfileUpdate = () => {

  const {authUser, updateProfile} = useContext(AuthContext)
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("authUser.fullName");
  const [bio, setBio] = useState("authUser.bio");
  // const [uid, setUid] = useState("");
  const navigate = useNavigate();
  // const [prevImage, setPrevImage] = useState("");
  // const { setUserData } = useContext(AppContext);

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  // const handleSubmit = async (e) =>{
  //   e.preventDefault();
  //   if(!selectedImg){
  //     await updateProfile({fullName:name, bio});
  //     navigate('/')
  //   }
  //   const reader = new FileReader();
  //   reader.readAsDataURL(selectedImg);
  //   reader.onload = async ()=>{
  //     const base64Image = reader.result;
  //     await updateProfile({profilePIC: base64Image, fullName: name, bio})
  //      navigate('/');
  //   }
  // }
  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("harsh 3")
  // Case 1: Agar koi nayi image select nahi hui hai
  if (!selectedImg || !(selectedImg instanceof File)) {
    console.log("No new image selected. Updating only Name and Bio...");
    try {
      await updateProfile({ fullName: name, bio });
      navigate('/');
    } catch (error) {
      console.error("Update failed without image:", error);
    }
    return; // 👈 CRITICAL: Yeh lagana zaroori hai taaki niche ka code na chale!
  }

  // Case 2: Agar user ne nayi image select ki hai
  console.log("New image detected. Converting to Base64...");
  const reader = new FileReader();
  reader.readAsDataURL(selectedImg);
  
  reader.onload = async () => {
    try {
      const base64Image = reader.result;
      console.log("Base64 conversion done. Sending to context...");
      //iske bad ye galat ho raha h
      await updateProfile({ profilePIC: base64Image, fullName: name, bio });
      navigate('/');
    } catch (error) {
      console.error("Update failed with image:", error);
    }
  };
};


  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile details</h3>
          <label htmlFor='avatar'>
            <input onChange={(e) => setSelectedImg(e.target.files[0])} id='avatar' type="file" accept=".png, .jpg, .jpeg" hidden />
           <img 
              src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePIC || assets.avatar_icon)} 
              alt="Avatar View" 
            />
            upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} placeholder='Your name' type="text" required />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write profile bio' required />

          <button type="submit">Save</button>

        </form>
        <img className='profile-pic' src={assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate


// const ProfileUpdate = () => {

//   const profileUpdate = async (event) => {
//     event.preventDefault();
//     try {
//       if (!prevImage && !image) {
//         toast.error("Upload profile picture")
//         return 0;
//       }
//       const docRef = doc(db, "users", uid);
//       if (image) {
//         const imgUrl = await upload(image);
//         setPrevImage(imgUrl);
//         await updateDoc(docRef, {
//           avatar: imgUrl,
//           bio: bio,
//           name: name
//         })
//       } else {
//         await updateDoc(docRef, {
//           bio: bio,
//           name: name
//         })
//       }
//       const snap = await getDoc(docRef);
//       setUserData(snap.data());
//       navigate('/chat')
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message)
//     }

//   }

//   useEffect(() => {
//     onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setUid(user.uid);
//         const docRef = doc(db, "users", user.uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.data().name) {
//           setName(docSnap.data().name);
//         }
//         if (docSnap.data().bio) {
//           setBio(docSnap.data().bio);
//         }
//         if (docSnap.data().avatar) {
//           setPrevImage(docSnap.data().avatar);
//         }
//       }
//       else {
//         navigate("/")
//       }
//     })
//   }, [])

//   return (
//     <div className='profile'>
//       <div className="profile-container">
//         <form onSubmit={profileUpdate}>
//           <h3>Profile details</h3>
//           <label htmlFor='avatar'>
//             <input onChange={(e) => setImage(e.target.files[0])} id='avatar' type="file" accept=".png, .jpg, .jpeg" hidden />
//             <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
//             upload profile image
//           </label>
//           <input onChange={(e) => setName(e.target.value)} value={name} placeholder='Your name' type="text" required />
//           <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write profile bio' required />
//           <button type="submit">Save</button>
//         </form>
//         <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
//       </div>
//     </div>
//   )
// }

// export default ProfileUpdate
