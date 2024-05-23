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
                        <Image src="" width={1000} height={1000} alt="avatar" />
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
                        <h3>0</h3>
                    </div>
                    <div>
                        <h3>Posts</h3>
                        <h3>0</h3>
                    </div>
                    <div>
                        <h3>Likes</h3>
                        <h3>0</h3>
                    </div>
                </div>
            </section>
        </motion.section>
    )
}

export default Profile
