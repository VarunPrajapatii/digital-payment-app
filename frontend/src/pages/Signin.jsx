import React, { useState } from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  return (
    <div className='bg-slate-300 h-screen flex justify-center' >
      <div className='flex flex-col justify-center '>
        <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
          <Heading label={"Sign In"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox onChange={e => {
            setEmail(e.target.value);
          }} placeholder={"xyz@email.com"} label={"Email"} />
          <InputBox onChange={e => {
            setPassword(e.target.value);
          }} placeholder={"password"} label={"Password"} />
          <div className='pt-4'>
            <Button onClick={async () => {
              const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                email,
                password
              });
              localStorage.setItem("token", response.data.token);
              navigate("/dashboard");
            }} label={"Sign In"} />
          </div>
          <div>
            <BottomWarning label={"Dont have an account?"} buttonText={"Sign Up"} to={"/signup"}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin
