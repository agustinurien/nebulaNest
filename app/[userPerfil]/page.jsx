"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Profile from "../components/Profile";
import { MdDone } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import LibraryPosts from "../components/LibraryPosts";


import { manrope } from "../fonts";
import Image from "next/image";
import { getDataUserFunction, uploadFileFunction, createLibraryFunction, crearPublicacionFunction, updateLibraries, deleteLibraryFunction } from "../functions/data";
import imagenFondo2 from '../../public/assets/illustration.jpg'
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";




const page = ({ params }) => {

    const userProfileName = params.userPerfil

    const [dataUser, setDataUser] = useState([])
    const [titulo, setTitulo] = useState('')
    const [libraryTitle, setLibraryTitle] = useState('')
    console.log(libraryTitle)
    const [libraryId, setLibraryId] = useState('')
    const [agregar, setAgregar] = useState(false)
    const [crearPost, setCrearPost] = useState(false)
    const [timer, setTimer] = useState(false)
    const [userLoged, setUserLoged] = useState(false)
    const [file, setFile] = useState()
    const [librariesTitles, setLibrariesTitles] = useState('');

    const [idDelete, setIdDelte] = useState('');
    const [askDelete, setAskDelete] = useState(false);




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
    const handleInputChange = (index, value) => {
        const newTitles = [...librariesTitles];
        newTitles[index] = value;
        setLibrariesTitles(newTitles);
    };
    const handleDoneClick = async () => {
        await updateLibraries(librariesTitles);
        setAgregar(false)
        getDataUser()
    };

    const deleteLibrary = async (index) => {
        if (dataUser) {
            await deleteLibraryFunction(dataUser, index)

        }

    }

    useEffect(() => {
        getDataUser()

    }, [userProfileName])
    useEffect(() => {
        if (dataUser && dataUser.libraries) {
            setLibrariesTitles(dataUser.libraries.map(library => library.titleL));
        }
    }, [dataUser]);




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
                askDelete &&

                <div className={`${manrope.className}`} style={{
                    backgroundColor: "rgba(0, 0, 0, 0.377)",
                    width: "100%",
                    height: "100%",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 999

                }}>
                    <div style={{
                        backgroundColor: "white",
                        width: 500,
                        height: 250,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 12,


                    }}>
                        <h2 style={{ margin: 0, textAlign: "center", fontSize: "1.2rem" }}>Are you sure you want to delete this library?</h2>
                        <p style={{ textAlign: "center", fontSize: "0.7rem" }}>By deleting, all the posts and data in this library will be gone forever. </p>
                        <div style={{ width: "80%" }}>
                            <button
                                className="done"
                                style={{ margin: 0, marginTop: 10, backgroundColor: "black" }}
                                onClick={() => (deleteLibrary(idDelete), setAskDelete(false))}>Delete</button>
                            <button
                                className="cancel"
                                style={{ margin: 0, marginTop: 10 }}
                                onClick={() => setAskDelete(false)} >Cancel</button>
                        </div>
                    </div>
                </div>
            }
            {
                crearPost &&
                <div className="crearPostContainer">
                    <div className="crearPostData">

                        {
                            timer &&
                            <div style={{
                                backgroundColor: "white",
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 12

                            }}>
                                <motion.div
                                    animate={{
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                                    }}
                                >
                                    <AiOutlineLoading3Quarters fontSize={40} />
                                </motion.div>
                            </div>
                        }
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
                                    <IoCloudUploadOutline />
                                </button>
                                <input id="fileInput" type="file" onChange={(e) => uploadFile(e.target.files[0])} style={{ display: 'none' }} />
                            </div>

                        </div>
                        <div className="contenedorBtnCrearP" >
                            <button onClick={() => (setCrearPost(false), setTitulo(""), setFile(undefined))} className="cancel">Cancel</button>

                            <button disabled={titulo === "" || !file} onClick={() => (crearPublicacion(), setTimer(true))}>Crear publicación</button>

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
                                            key={library.libraryId}>
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
                                    <>
                                        <div className="contenedorInput">
                                            <input
                                                type="text"
                                                value={libraryTitle}
                                                onChange={(e) => setLibraryTitle(e.target.value)}
                                                className="inputAgregar"
                                                placeholder="Add Library" />
                                            <button
                                                disabled={libraryTitle === ''}
                                                className="addLibrary"
                                                onClick={() => (crearLibrary(), setAgregar(false))}><MdDone /></button>
                                            {
                                                agregar &&

                                                dataUser?.libraries &&


                                                <div className="contenedorLibrariesEdit">
                                                    {
                                                        librariesTitles &&
                                                        librariesTitles.map((library, index) => {

                                                            return (
                                                                <div className="libraryEdit" key={index}>
                                                                    <input
                                                                        type="text"
                                                                        value={library}
                                                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                                                    />
                                                                    <button
                                                                        disabled={librariesTitles?.length <= 1}
                                                                        onClick={() => (setIdDelte(index), setAskDelete(true))}
                                                                        className="eliminarLibrary">x</button>

                                                                </div>


                                                            )
                                                        })
                                                    }
                                                    <button
                                                        onClick={handleDoneClick}
                                                        className={`${manrope.className} botonDoneLibraryEdit`}>done</button>

                                                </div>
                                            }

                                        </div>
                                    </>
                                    : <button className={`${manrope.className} btnAddLibrary`} onClick={() => setAgregar(true)}>Edit Libraries</button>
                            )
                        }
                    </div>

                    <section className="contenedorPublicacionPerfil">
                        {userLoged === true &&
                            <button onClick={() => setCrearPost(true)} className="contenedorAgregarPost"><CiCirclePlus /></button>
                        }
                        <LibraryPosts libraryId={libraryId} dataUser={dataUser} userLoged={userLoged} />


                    </section>


                </section>

            </section>




        </section>
    );
};


export default page;
