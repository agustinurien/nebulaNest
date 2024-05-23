import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import { manrope } from "../fonts";
import { findLibrary } from "../functions/data";
import { Skeleton } from "@mui/material";
import Image from "next/image";

const LibraryPosts = ({ dataUser, libraryId }) => {

    const [selectedLibrary, setSelectedLibrary] = useState()
    const [triggerEffect, setTriggerEffect] = useState()


    useEffect(() => {
        const fetchLibrary = async () => {
            const library = await findLibrary(dataUser, libraryId);
            setSelectedLibrary(library);
        };

        fetchLibrary();
    }, [dataUser, libraryId]);

    return (
        <>
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
                                        <h1 className={`${manrope.className}`}>{post.titleP}</h1>
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
