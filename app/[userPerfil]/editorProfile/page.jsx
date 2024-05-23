"use client"
import React, { useEffect, useState } from 'react'
import { canEditProfile } from '../../functions/data'
import Form from '../../components/Form'
import Image from 'next/image'
import design1 from "../../../public/assets/designLeft.jpg"
import design2 from "../../../public/assets/designRight.jpg"

const page = ({ params }) => {
    const [dataUser, setDataUser] = useState()
    console.log(dataUser)
    const userProfileName = params.userPerfil

    useEffect(() => {
        const getData = async () => {
            const res = await canEditProfile(userProfileName)
            setDataUser({ ...res.data() });
        }
        getData()
    }, [userProfileName])

    return (
        <section className='conteendorPageEdit'>
            <div className='contenedorImageEdit'>
                <Image
                    src={design1}
                    width={2000}
                    height={2000}
                    alt='design'
                    className='design'
                ></Image>
                <div className='effectGradiant'>

                </div>
            </div>
            <Form />
            <div className='contenedorImageEdit2'>
                <Image
                    src={design2}
                    width={2000}
                    height={2000}
                    alt='design'
                    className='design2'
                ></Image>
                <div className='effectGradiant2'>

                </div>
            </div>
        </section>
    )
}

export default page
