import React from 'react'
import Appbar from '../components/Appbar'
import SendMoney from './SendMoney'
import Balance from '../components/Balance'
import Users from '../components/Users'

const Dashboard = () => {
  return (
    <div>
      <Appbar />
      <div className='m-8'>
        <Balance value={"10000"} />
        <Users />
      </div>
    </div>
  )
}

export default Dashboard
