import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

async function getDataUserFunction(userProfileName) {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const userDoc = querySnapshot.docs.find(doc => doc.data().user_name === userProfileName);
    return userDoc;
}
async function findLibrary(dataUser, libraryId) {
    const libreria = await dataUser.libraries?.find((library) => library.libraryId === libraryId)
    return libreria;
}

async function uploadFileFunction(file) {
    const storageRef = ref(storage, uuidv4());
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}
async function createLibraryFunction(dataUserId, libraryTitle) {
    const userDocumentRef = doc(db, 'users', dataUserId);

    const userSnapshot = await getDoc(userDocumentRef);
    const userData = userSnapshot.data();

    const newLibrary = {
        titleL: libraryTitle,
        libraryId: uuidv4()
    };

    if (userData) {
        const newLibraryArray = [...(userData.libraries || []), newLibrary]

        await updateDoc(userDocumentRef, {
            libraries: newLibraryArray
        });
    }
    return
}
async function crearPublicacionFunction(dataUserId, titulo, file, libraryId) {
    const userDocumentRef = doc(db, 'users', dataUserId);

    const userSnapshot = await getDoc(userDocumentRef);
    const userData = userSnapshot.data();

    const newPost = {
        titleP: titulo,
        imageUrl: file
    };

    if (userData) {
        const selectedLibrary = userData.libraries.find(library => library.libraryId === libraryId);


        if (selectedLibrary) {
            const newPostsArray = [...(selectedLibrary.posts || []), newPost];
            await updateDoc(userDocumentRef, {
                libraries: userData.libraries.map(library => {
                    if (library.libraryId === libraryId) {
                        return {
                            ...library,
                            posts: newPostsArray
                        };
                    }
                    return library;
                })
            });

            console.log('Post creado con éxito en la biblioteca seleccionada');

        } else {
            console.error('La biblioteca seleccionada no fue encontrada');
        }
    } else {
        console.error('No se encontraron datos del usuario');
    }
    return
}

async function getAllPosts() {
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);

    const allPosts = usersSnapshot.docs.reduce((acc, doc) => {
        const userData = doc.data();
        const userName = userData.user_name;
        const userAvatar = userData.avatar;
        const userColor = userData.color;
        const userLibraries = userData.libraries || [];

        userLibraries.forEach(library => {
            const libraryName = library.titleL; // Assuming there's a name for the library
            const libraryPosts = library.posts || [];
            libraryPosts.forEach(post => {
                acc.push({
                    userId: doc.id,
                    userName: userName,
                    userAvatar: userAvatar,
                    userColor: userColor,
                    libraryId: library.libraryId,
                    libraryName: libraryName,
                    title: post.titleP,
                    imageUrl: post.imageUrl,
                    timestamp: post.timestamp
                });
            });
        });
        return acc;
    }, []);

    return allPosts;
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
function canEditProfile(userProfileName) {
    const userDoc = getDataUserFunction(userProfileName).then(userDoc => {
        if (userDoc) {
            const userDocId = userDoc.id;
            const localStorageUserId = localStorage.getItem('user_id'); // Asume que el ID del usuario está almacenado en 'userId'

            if (userDocId === localStorageUserId) {
                return userDoc

            } else {
                console.log('Acceso denegado. Redirigiendo a 404.');

                window.location.href = '/404';
            }
        } else {
            console.log('No se encontró el documento del usuario.');

            window.location.href = '/404';
        }
    }).catch(error => {
        console.error('Error obteniendo el documento del usuario:', error);
        window.location.href = '/404';
    });
    return userDoc
}

export { canEditProfile, shuffleArray, getAllPosts, getDataUserFunction, uploadFileFunction, createLibraryFunction, crearPublicacionFunction, findLibrary };

