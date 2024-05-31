import { motion } from "framer-motion"
import { manrope } from "../fonts"
import Image from "next/image"

const Profile = ({ userLoged, dataUser }) => {
    return (
        <motion.section
            initial={{
                y: -180
            }}
            className={`${manrope.className} contenedorProfile`}>
            <div className="fotoProfile" style={{ backgroundColor: `${dataUser.color}` }}>
                {
                    dataUser.avatar !== '' ?
                        <Image src={dataUser.avatar} width={1000} height={1000} alt="avatar" className="avatarEdit" />
                        :
                        <h2>{dataUser.user_name.charAt(0).toUpperCase()}</h2>
                }
            </div>
            <div className="dataProfile">
                <h2>{dataUser.user_name}</h2>
                <span>{dataUser.email}</span>

            </div>
            <div className="btnsProfile">
                {
                    userLoged === true ?
                        <a
                            href={`/${dataUser.user_name}/editorProfile`}
                            className={`${manrope.className} editProfile`}
                        >
                            Edit Profile
                        </a>

                        :
                        <button className={`${manrope.className} follow`}>Follow</button>

                }

            </div>
            <section className="contenedorStats">
                <div className="textStats">
                    <div>
                        <h3>Followers</h3>
                        <h3>0</h3>
                    </div>
                    <div>
                        <h3>Libraries</h3>
                        <h3>{dataUser?.libraries?.length}</h3>
                    </div>
                    <div>
                        <h3>Posts</h3>
                        <h3>{dataUser?.libraries?.reduce((totalPosts, library) => totalPosts + (library.posts ? library.posts.length : 0), 0)}</h3>
                    </div>
                    <div>
                        <h3>Likes</h3>
                        <h3>0</h3>
                    </div>
                </div>
            </section>
            <section style={{ marginTop: 20 }} className="contenedorStats">
                <div className="textStats">

                    <div style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        paddingBottom: 20
                    }}>
                        <h3>Website</h3>
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                        }}>
                            {
                                dataUser.website ?
                                    <a href={dataUser.website} style={{
                                        margin: 0,
                                        color: "grey",
                                        fontSize: 13,
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                    }}>{dataUser.website}</a>
                                    :
                                    <span>-</span>
                            }
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
                        <h3>About me</h3>
                        <p style={{ margin: 0, opacity: 0.8 }}>{dataUser.bio ? dataUser.bio : '-'}</p>
                    </div>
                </div>
            </section>
        </motion.section>
    )
}

export default Profile
