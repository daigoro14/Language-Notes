import React, { useState } from 'react'
import '../styles/style.css'
import loginStyle from '../styles/login.module.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {url} from '../App'


export default function LoginPage() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    let params = useParams()
    const navigate = useNavigate()

    console.log(params)

    async function login() {
        console.log(username, password)
        await fetch(`${url}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        })
        .then(res => {
            res.json()
            navigate(`/`)
        })
    }

  return (
    <div>
        <div className={`navBar ${loginStyle.navBar}`}>
            <h1>Choose a Login Method</h1>
        </div>

        <div className={loginStyle.content}>
            <div className={loginStyle.wrapper}>
                <div className={loginStyle.left}>
                    <div className={`${loginStyle.loginButton} ${loginStyle.google}`}>
                        <img className={loginStyle.icon} src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google icon" />
                        Google
                    </div>
                    <div className={`${loginStyle.loginButton} ${loginStyle.facebook}`}>
                    <svg className={loginStyle.icon} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" version="1.1">
                        <g id="Icons" stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
                            <g id="Color-" transform="translate(-200.000000, -160.000000)">
                                <path d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z" id="Facebook">
                                </path>
                            </g>
                        </g>
                    </svg>
                    {/* <svg className={loginStyle.icon} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32"><path d="M21.95 5.005l-3.306-.004c-3.206 0-5.277 2.124-5.277 5.415v2.495H10.05v4.515h3.317l-.004 9.575h4.641l.004-9.575h3.806l-.003-4.514h-3.803v-2.117c0-1.018.241-1.533 1.566-1.533l2.366-.001.01-4.256z"/></svg> */}
                        Facebook
                    </div>
                </div>
                <div className={loginStyle.center}>
                    <div className={loginStyle.line}/>
                    <div className={loginStyle.or}>OR</div>
                </div>
                <div className={loginStyle.right}>
                    <input type="text" placeholder='Username' onChange={(e) => {setUsername(e.target.value)}}/>
                    <input type="password" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}/>
                    <button className={loginStyle.submit} onClick={login}>Login</button>
                    <Link to="/signup">No account? Sign up here.</Link>
                </div>
            </div>
        </div>
    </div>
  )
}
