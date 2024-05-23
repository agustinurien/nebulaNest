"use client"

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDocs } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

const auth = getAuth();

const Page = () => {
    const [noEstaRegistrado, setNoEstaRegistrado] = useState(false);

    const logear = async (e) => {
        e.preventDefault();
        const usernameOrEmail = e.target.elements.usernameOrEmail.value;
        const password = e.target.elements.password.value;

        try {
            const isEmail = usernameOrEmail.includes('@');

            if (isEmail) {
                await signInWithEmailAndPassword(auth, usernameOrEmail, password);
                const querySnapshot = await getDocs(collection(db, 'users'));
                const userDoc = querySnapshot.docs.find(doc => doc.data().email === usernameOrEmail);

                if (userDoc) {
                    localStorage.setItem("user_email", usernameOrEmail);
                    localStorage.setItem("user_name", userDoc.data().user_name);
                    localStorage.setItem("user_id", userDoc.id);
                    document.getElementById('homePage').click()
                }

            } else {
                // Buscar usuario por nombre de usuario
                const querySnapshot = await getDocs(collection(db, 'users'));
                const userDoc = querySnapshot.docs.find(doc => doc.data().user_name === usernameOrEmail);

                if (userDoc) {
                    // Si se encuentra el usuario, iniciar sesión con su correo electrónico
                    const userData = userDoc.data();
                    await signInWithEmailAndPassword(auth, userData.email, password);


                    // Guardar los datos del usuario en el almacenamiento local
                    localStorage.setItem("user_email", userData.email);
                    localStorage.setItem("user_name", userData.user_name);
                    localStorage.setItem("user_id", userDoc.id);
                    document.getElementById('homePage').click()
                } else {
                    console.log("Nombre de usuario no encontrado");
                }

            }


        } catch (error) {
            console.error(error);
            setNoEstaRegistrado(true);
        }
    };

    return (
        <div className="login">
            <form onSubmit={logear}>
                <input
                    type="text"
                    placeholder="Nombre de usuario o correo electrónico"
                    id="usernameOrEmail"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    id="password"
                />
                <button type="submit">Continuar</button>
                <a style={{ display: "none" }} href="/" id="homePage"></a>
            </form>
        </div>
    );
};

export default Page;
