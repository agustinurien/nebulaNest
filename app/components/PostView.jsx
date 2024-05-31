import { IoMdClose } from "react-icons/io"
import { manrope } from "../fonts"
import Image from "next/image"


const PostView = ({ modalPost, handleCloseModal }) => {
    return (
        <div className={`${manrope.className} contenedorPostView`}>
            <div className="postView">
                <div className="contenedorPerfilView">
                    <div className="picUsername">
                        {
                            modalPost.userAvatar !== '' ?
                                <Image
                                    src={modalPost.userAvatar}
                                    width={30}
                                    height={30}
                                    alt="avatar"
                                    style={{ borderRadius: "100%", }}
                                />
                                :
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 30, height: 30, backgroundColor: `${modalPost.userColor}`, borderRadius: "100%", color: "white" }}>
                                    <span style={{ fontSize: "0.5rem" }}>{modalPost.userName.charAt(0).toUpperCase()}</span>
                                </div>
                        }
                        <h3 >{modalPost.userName}</h3>
                    </div>
                    <button className="botonCloseView" onClick={handleCloseModal}><IoMdClose /></button>
                </div>

                <div className="contenedorImageView">
                    <Image
                        src={modalPost.imageUrl}
                        width={1000}
                        height={1000}
                        alt="postView"
                        className="imageViewPost"
                    />
                </div>

                <div className="infoPostView">
                    <h2 >{modalPost.title}</h2>
                    <div className="contenedorText">
                        <p>Lorem ipsum, dolor
                            sit amet consectetur adipisicing elit. In, quis.
                            Facilis laudantium hic veniam sapiente,
                            itaque eveniet velit quod, excepturi
                            blanditiis quis corrupti voluptates
                            illo iusto quidem quaerat. Officia,
                            error?
                            Lorem ipsum, dolor
                            sit amet consectetur adipisicing elit. In, quis.
                            Facilis laudantium hic veniam sapiente,
                            itaque eveniet velit quod, excepturi
                            blanditiis quis corrupti voluptates
                            illo iusto quidem quaerat. Officia,
                            error?</p>

                    </div>
                    <div className="textEffect"></div>
                    <div className="textEffect2"></div>
                </div>

            </div>
        </div>
    )
}

export default PostView
