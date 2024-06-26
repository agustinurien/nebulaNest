"use client"
import { useEffect, useState } from "react";
import { manrope } from "../fonts"
import { MdTune } from "react-icons/md";
import { getAllPosts, shuffleArray } from "../functions/data";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";
import { motion } from "framer-motion";
import { set } from "firebase/database";
import { IoMdClose } from "react-icons/io";
import { Skeleton } from "@mui/material";
import PostView from "./PostView";


const Card = () => {
    const [posts, setPosts] = useState([]);
    const [showTitle, setShowTitle] = useState(false);
    const [modalPost, setModalPost] = useState(null);
    const skeletons = [0, 1, 2, 3, 4, , 5, 6, 7]

    useEffect(() => {
        const fetchPosts = async () => {
            const allPosts = await getAllPosts();
            setPosts(shuffleArray(allPosts));
        };

        fetchPosts();
    }, []);

    const handleImageClick = (post) => {
        setModalPost(post);
    };

    const handleCloseModal = () => {
        setModalPost(null);
    };


    return (
        <>
            <div className={`${manrope.className} exploreContainer`}>
                <h2>Explore</h2>
                <button className={`${manrope.className}`}><MdTune style={{ fontSize: "1rem" }} /> Filter</button>
            </div>

            <section className="sectionCards">
                {
                    posts.length <= 0 &&
                    skeletons.map((skeleton, index) => (

                        <div
                            key={index}
                            className="cardContainer"
                        >
                            <div style={{ height: "100%" }}>
                                <Skeleton variant="rectangular" width={260} height={240} style={{ height: "100%", width: "100%", borderRadius: 8 }} />
                            </div>
                            <div className={`${manrope.className} infoUserBasic`}>
                                <div style={{ marginTop: 5 }}>
                                    <Skeleton
                                        variant="circular"
                                        width={40}
                                        height={40}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: 25, height: 25,
                                            borderRadius: "100%",
                                            color: "white",

                                        }} />
                                    <Skeleton width={120} />
                                </div>

                            </div>

                        </div>
                    ))

                }
                {posts.map((post, index) => (


                    <div
                        onMouseOver={() => setShowTitle(index)}
                        onMouseOut={() => setShowTitle(null)}
                        key={index}
                        className="cardContainer"
                    >



                        <div className="containerPostHome"
                            onClick={() => handleImageClick(post)}
                        >
                            <Image
                                width={1000}
                                height={1000}
                                src={post.imageUrl}
                                alt={post.title}
                                className="postImageHome" />

                            {
                                showTitle === index &&
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="contenedorTituloPostHome"
                                >
                                    <h1 className={`${manrope.className} tituloPostHome`}>{post.title}</h1>
                                </motion.div>
                            }
                        </div>


                        <div className={`${manrope.className} infoUserBasic`}>

                            <div>
                                {
                                    post.userAvatar !== '' ?
                                        <Image
                                            src={post.userAvatar}
                                            width={64}
                                            height={64}
                                            alt="avatar"
                                            className="avatarUser"
                                        />
                                        :
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 25, height: 25, backgroundColor: `${post.userColor}`, borderRadius: "100%", color: "white" }}>
                                            <span style={{ fontSize: "0.5rem" }}>{post.userName.charAt(0).toUpperCase()}</span>
                                        </div>
                                }

                                <a href={`${post.userName}`} style={{ color: "inherit", textDecoration: "none" }}>
                                    <p className="userHome">{post.userName}</p>
                                </a>
                            </div>
                            <div className="userHomeStats">
                                <p> <IoEye /> 5k</p>
                                <p> <FaRegHeart /> 12k</p>
                            </div>
                        </div>
                    </div>

                ))}
            </section >
            {modalPost && (
                <PostView modalPost={modalPost} handleCloseModal={handleCloseModal} />
            )
            }
        </>
    )
}

export default Card
