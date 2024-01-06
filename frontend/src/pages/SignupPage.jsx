import React, { useState } from 'react'
import loginStyle from '../styles/login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import {url} from '../App'

export default function SignupPage() {

    const navigate = useNavigate()


    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function signUp() {
        console.log(username, password)
        await fetch(`${url}/user/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        })
        .then(res => {
            res.json()
            navigate(`/login`)
        })
    }

  return (
    <div>
        <div className={`navBar ${loginStyle.navBar}`}>
            <h1>Signup</h1>
        </div>

        <div className={loginStyle.content}>
            <div className={loginStyle.wrapper}>
                <div className={loginStyle.right}>
                    <input type="text" placeholder='Username' onChange={(e) => {setUsername(e.target.value)}}/>
                    <input type="password" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}/>
                    <button className={loginStyle.submit} onClick={signUp}>Signup</button>
                    <Link to="/login">Already have an account?.</Link>
                </div>
            </div>
        </div>
    </div>
  )
}
