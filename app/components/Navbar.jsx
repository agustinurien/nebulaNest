"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../../public/assets/logo.png'
import defaultProfilePicture from '../../public/assets/profileDefault.jpg'
import { manrope, chivoMono } from '../fonts'
import { getDataUserFunction } from '../functions/data'

const Navbar = () => {



    const [data, setData] = useState()

    const [userEmail, setUserEmail] = useState()
    const [userName, setUserName] = useState()

    const [open, setOpen] = useState(false)

    useEffect(() => {
        const getData = async () => {
            const user_email = localStorage.getItem("user_email")
            const user_name = localStorage.getItem("user_name")
            setUserName(user_name)
            setUserEmail(user_email)

            const data = await getDataUserFunction(user_name)

            if (data) {
                setData({ ...data.data() });
            }
        }

        getData()
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

                                className='profileImageContainer'
                                style={{ backgroundColor: `${data?.color}` }}>
                                {
                                    data?.avatar ?
                                        <Image
                                            className='logo avatarEdit'
                                            src={data.avatar}
                                            width={1000}
                                            height={1000}
                                            alt='logo'

                                        />
                                        :
                                        <h2 className='initial'>{userName.charAt(0).toUpperCase()}</h2>
                                }

                            </div>

                            {
                                open === true &&

                                <div
                                    onMouseOver={() => setOpen(true)}
                                    className='viewProfile'>
                                    <h3>{userName}</h3>
                                    <h4>{userEmail}</h4>
                                    <a href={`/${userName}`} className='profile'>View Profile</a>
                                    <div className='logOut'>
                                        <a href="/" onClick={() => localStorage.clear()}>Log out</a>
                                    </div>
                                    <button style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        marginTop: 5,
                                        marginRight: 5,
                                        borderRadius: "100%",
                                        border: 0,
                                    }}
                                        onClick={() => setOpen(false)}
                                    >x</button>
                                </div>

                            }

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
