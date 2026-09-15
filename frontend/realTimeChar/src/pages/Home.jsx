import React from 'react'
import SideBar from '../components/SideBar'
import MessageAreas from '../components/MessageAreas'
import useGetMessages from '../customHooks/getMessages.jsx'

function Home() {
  useGetMessages();
  return (
    <div className="w-full h-[100vh] flex">
      <SideBar></SideBar>
      <MessageAreas></MessageAreas>
    </div>
  )
}

export default Home
