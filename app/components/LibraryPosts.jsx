import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import { manrope } from "../fonts";
import { deletePostInLibrary, findLibrary, updatePostInLibrary, uploadFileFunction } from "../functions/data";
import { Skeleton } from "@mui/material";
import { MdDone, MdModeEditOutline, MdOutlineCloudUpload } from "react-icons/md";
import Image from "next/image";
import { CiCirclePlus } from "react-icons/ci";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CgEnter } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { LuTrash } from "react-icons/lu";
import { AiOutlineLoading3Quarters } from "react-icons/ai";




const LibraryPosts = ({ dataUser, libraryId, userLoged }) => {

    const [selectedLibrary, setSelectedLibrary] = useState()
    const [triggerEffect, setTriggerEffect] = useState(0)

    const [edit, setEdit] = useState(false)
    const [file, setFile] = useState('')
    const [title, setTitle] = useState('')
    const [indexPost, setIndexPost] = useState('')
    const [timer, setTimer] = useState(false)

    const handleClick = () => {
        document.getElementById('fileInput').click()
    };

    const uploadFile = async (file) => {
        const result = await uploadFileFunction(file)
        setFile(result)
    }

    const fetchLibrary = async () => {
        const library = await findLibrary(dataUser, libraryId);
        setSelectedLibrary(library);
    };

    const editPost = (post, index) => {
        setFile(post.imageUrl)
        setIndexPost(index)
        setTitle(post.titleP)
        setEdit(true)
    }
    const editPostBack = async () => {
        await updatePostInLibrary(file, title, libraryId, indexPost)
    }
    const deletePost = async () => {
        await deletePostInLibrary(libraryId, indexPost)
        setTimer(false)
    }

    useEffect(() => {
        fetchLibrary();
    }, [dataUser, libraryId]);

    return (
        <>
            {
                edit &&
                <div className="fondoEditPost">

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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="titlePost"
                            placeholder="Title"
                        />
                        <div className="preImage">
                            {

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
                                    onClick={() => handleClick()}
                                >

                                    <IoCloudUploadOutline />
                                </button>
                                <input id="fileInput" type="file" onChange={(e) => uploadFile(e.target.files[0])} style={{ display: 'none' }} />
                            </div>

                        </div>
                        <div className="contenedorEditarPostBotones" >

                            <button onClick={() => (editPostBack(libraryId), setTimer(true))} className="doneEdit">Save</button>
                            <button onClick={() => (setEdit(false), setTitle(""), setFile(undefined))} className="cancel2">Cancel</button>


                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <button onClick={() => (deletePost(), setTimer(true))} className="deletePost">Delete post</button>
                        </div>
                    </div>
                </div >


            }
            {
                selectedLibrary && selectedLibrary.posts ?
                    selectedLibrary.posts.map((post, index) => {
                        return (
                            <motion.div
                                whileHover={() => setTriggerEffect(index)}
                                onMouseOut={() => setTriggerEffect(undefined)}
                                key={index}
                                className="contenedorPostProfile">
                                <Image src={post.imageUrl} width={1000} height={1000} alt="imagePost" className="postImage" />
                                {
                                    triggerEffect === index &&
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="efectoSombra"></motion.div>
                                        {
                                            userLoged === true &&
                                            <div className="contenedorEditPost">
                                                <button onClick={() => editPost(post, index)} className="editPost"><MdModeEditOutline fontSize={17} /></button>
                                            </div>
                                        }
                                        <h2 className={`${manrope.className}`}>{post.titleP}</h2>
                                    </>
                                }

                            </motion.div>

                        )
                    })
                    : (
                        !selectedLibrary ?
                            <div className="contenedorSkeleton">
                                <Skeleton variant="rectangular" width={260} height={240} className="skeleton" />
                                <Skeleton variant="rectangular" width={260} height={240} className="skeleton" />
                                <Skeleton variant="rectangular" width={260} height={240} className="skeleton" />
                                <Skeleton variant="rectangular" width={260} height={240} className="skeleton" />

                            </div>
                            :
                            ''
                    )

            }

        </>
    )
}

export default LibraryPosts
