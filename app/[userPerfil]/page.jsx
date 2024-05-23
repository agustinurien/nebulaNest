"use client"

import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from 'uuid';
import Profile from "../components/Profile";
import { MdDone } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import LibraryPosts from "../components/LibraryPosts";


import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { manrope } from "../fonts";
import Image from "next/image";
import { getDataUserFunction, uploadFileFunction, createLibraryFunction, crearPublicacionFunction } from "../functions/data";
import imagenFondo2 from '../../public/assets/illustration.jpg'




const page = ({ params }) => {

    const userProfileName = params.userPerfil

    const [dataUser, setDataUser] = useState([])

    const [titulo, setTitulo] = useState('')
    const [libraryTitle, setLibraryTitle] = useState('')
    const [libraryId, setLibraryId] = useState('')
    const [agregar, setAgregar] = useState(false)
    const [crearPost, setCrearPost] = useState(false)
    const [timer, setTimer] = useState(false)

    const [userLoged, setUserLoged] = useState(false)

    const [file, setFile] = useState()


    const crearPublicacion = async () => {
        try {
            await crearPublicacionFunction(dataUser.id, titulo, file, libraryId)
            getDataUser()
            setTimer(false)
            setCrearPost(false)
            setFile('')
            setTitulo('')
        } catch (error) {
            console.error('Error al crear el post:', error);
        }
    };

    const crearLibrary = async () => {
        try {
            await createLibraryFunction(dataUser.id, libraryTitle)
            getDataUser()

        } catch (error) {
            console.error('Error al crear la libreria:', error);
        }
    };


    const getDataUser = async () => {
        const userId = localStorage.getItem('user_id');
        const userDoc = await getDataUserFunction(userProfileName);
        if (userDoc) {
            setDataUser({ id: userDoc.id, ...userDoc.data() });
            if (libraryId === '') {
                setLibraryId(userDoc.data().libraries[0].libraryId);
            } else {
                return;
            }

            if (userDoc.id === userId) {
                setUserLoged(true);
            }
        } else {
            console.error("No se encontró ningún documento de usuario.");
        }
    };



    const handleClick = () => {
        document.getElementById('fileInput').click()
    };

    const uploadFile = async (file) => {
        const result = await uploadFileFunction(file)
        setFile(result)
    }

    useEffect(() => {
        getDataUser()
    }, [userProfileName])




    return (
        <section className="section">

            <div className="fondo">
                <Image
                    src={imagenFondo2}
                    width={6000}
                    height={4000}
                    className="fondoPerfil"
                ></Image>
                <div className="fondoEffect">

                </div>
            </div>
            {
                crearPost &&
                <div className="crearPostContainer">
                    <div className="crearPostData">
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="titlePost"
                            placeholder="Title"
                        />
                        <div className="preImage">
                            {
                                file &&
                                <div className="contenedorImagePre">
                                    <Image
                                        width={1000}
                                        height={1000}
                                        src={file} alt={file}
                                        loading="lazy"
                                        className="imagenPreview" />
                                </div>
                            }
                            <div className="contenedorBtnSelecccionar">
                                <button className="seleccionarArchivo"
                                    onClick={() => handleClick()}>
                                    <CiCirclePlus />
                                </button>
                                <input id="fileInput" type="file" onChange={(e) => uploadFile(e.target.files[0])} style={{ display: 'none' }} />
                            </div>

                        </div>
                        <div className="contenedorBtnCrearP" >
                            <button onClick={() => (setCrearPost(false), setTitulo(""), setFile(undefined))} className="cancel">Cancel</button>
                            {
                                timer ?
                                    <button >...</button>
                                    :
                                    <button disabled={titulo === "" || !file} onClick={() => (crearPublicacion(), setTimer(true))}>Crear publicación</button>
                            }
                        </div>
                    </div>
                </div>
            }

            <section className="mainProfile">
                <Profile dataUser={dataUser} userLoged={userLoged} />
                <section className="sectionLibrary">
                    <div className="contenedorLibrary">
                        <div>
                            {
                                dataUser && dataUser.libraries &&
                                dataUser.libraries.map((library, index) => {


                                    return (
                                        <button
                                            className={library.libraryId === libraryId ? `${manrope.className} selectedL` : `${manrope.className}`}
                                            onClick={() => setLibraryId(library.libraryId)}
                                            key={index}>
                                            {library.titleL}
                                        </button>

                                    )
                                })
                            }
                        </div>

                        {
                            userLoged === true &&
                            (
                                agregar ?
                                    <div className="contenedorInput">
                                        <input type="text" value={libraryTitle} onChange={(e) => setLibraryTitle(e.target.value)} className="inputAgregar" />
                                        <button className="addLibrary" onClick={() => (crearLibrary(), setAgregar(false))}><MdDone /></button>
                                    </div>
                                    : <button className={`${manrope.className} btnAddLibrary`} onClick={() => setAgregar(true)}>Add a library</button>
                            )
                        }
                    </div>

                    <section className="contenedorPublicacionPerfil">
                        <LibraryPosts libraryId={libraryId} dataUser={dataUser} />

                        {userLoged === true &&
                            <button onClick={() => setCrearPost(true)} className="contenedorAgregarPost"><CiCirclePlus /></button>
                        }

                    </section>


                </section>

            </section>




        </section>
    );
};


export default page;
