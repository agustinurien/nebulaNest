"use client"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const auth = getAuth();
const page = () => {

    const [userName, setUserName] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        try {
            // Verificar si ya existe un usuario con el mismo nombre de usuario
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userNameExists = querySnapshot.docs.some(doc => doc.data().user_name === userName);

            if (userNameExists) {
                console.log("Ya existe este nombre de usuario");
            } else {
                const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
                const componentToHex = (c) => {
                    const hex = c.toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                };
                const generateBrightColorHex = () => {
                    const r = getRandomInt(150, 255);
                    const g = getRandomInt(150, 255);
                    const b = getRandomInt(150, 255);
                    const components = [r, g, b];
                    const brightComponentIndex = getRandomInt(0, 2);
                    components[brightComponentIndex] = getRandomInt(200, 255);
                    return `#${componentToHex(components[0])}${componentToHex(components[1])}${componentToHex(components[2])}`;
                };
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Guardar el usuario en la colección de usuarios
                const docRef = await addDoc(collection(db, 'users'), {
                    libraries: [
                        {
                            libraryId: uuidv4(),
                            titleL: "work"
                        }
                    ],
                    email: user.email,
                    user_name: userName,
                    avatar: '',
                    color: generateBrightColorHex(),
                });

                // Obtener el ID del documento recién creado y guardarlo en el almacenamiento local
                const docId = docRef.id;
                localStorage.setItem("user_email", email);
                localStorage.setItem("user_name", userName);
                localStorage.setItem("user_id", docId);

                document.getElementById('homePage').click()
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error.message);
        }
    };


    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setUserName(e.target.value)}
                    type="text"
                    placeholder="Username"
                    id="username" />
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    id="email" />

                <input
                    type="password"
                    placeholder="Contraseña"
                    id="password" />

                <button type="submit">Continuar</button>
                <a style={{ display: "none" }} href="/" id="homePage"></a>


            </form>
        </div>
    )
}

export default page
