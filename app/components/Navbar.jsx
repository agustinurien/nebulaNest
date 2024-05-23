"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../../public/assets/logo.png'
import defaultProfilePicture from '../../public/assets/profileDefault.jpg'
import { manrope, chivoMono } from '../fonts'

const Navbar = () => {
    const a = true

    const [userEmail, setUserEmail] = useState()
    const [userName, setUserName] = useState()

    const [open, setOpen] = useState(false)

    useEffect(() => {
        const user_email = localStorage.getItem("user_email")
        const user_name = localStorage.getItem("user_name")
        setUserName(user_name)
        setUserEmail(user_email)
    }, []);

    return (
        <div className={`${chivoMono.className} navbarContainer`}>
            <nav className='navbar'>
                <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
                    <div className='contenedorLogo'>

                        <div className='contenedorImagenLogo'>

                            <Image
                                className='logo'
                                src={logo}
                                width={80}
                                height={70}
                                alt='logo'
                            />
                        </div>

                        <p>NEBULANEST</p>
                    </div>
                </a>
                <div className={`${manrope.className} logsContainer`}>

                    {userName ?
                        <>
                            <div
                                onMouseOver={() => setOpen(true)}

                                className='profileImageContainer'>
                                <Image
                                    src={defaultProfilePicture}
                                    width={50}
                                    height={50}
                                    alt='profileImage'
                                    className='profileImage'
                                />
                                <h2 className='initial'></h2>
                            </div>

                            {
                                open === true &&
                                <div

                                    className='contenedorViewProfile'>
                                    <h3>{userName}</h3>
                                    <h4>{userEmail}</h4>
                                    <a href={`/${userName}`} className='profile'>View Profile</a>
                                    <div className='logOut'>
                                        <a href="/" onClick={() => localStorage.clear()}>Log out</a>
                                    </div>
                                </div>}

                        </>
                        :
                        <>
                            <a href={`/sign-up`} className={`${manrope.className} signUp`}>Register</a>
                            <a href={`/log-in`} className={`${manrope.className} logIn`}>Log-In</a>
                        </>
                    }

                </div>
            </nav >
        </div >
    )
}

export default Navbar
