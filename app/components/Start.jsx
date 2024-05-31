import Image from 'next/image'
import imagenFondo from '../../public/assets/illustration.webp'
import imagenFondo2 from '../../public/assets/illustration.jpg'
import { manrope } from '../fonts'

const Start = () => {
    return (
        <section className='sectionIntro'>
            <div className={`${manrope.className} textContainer`}>
                <h1>The Nest of brilliant<br />creations</h1>
                <p>Welcome to where creativity finds its celestial home. In this <br /> boundless galaxy of inspiration, ideas spark like stars, and <br />imagination knows no bounds.</p>
            </div>


            <Image
                src={imagenFondo2}
                width={6000}
                height={4000}
                className='imagenFondo'
                alt='imagenFondo'
            ></Image>

        </section>
    )
}

export default Start
