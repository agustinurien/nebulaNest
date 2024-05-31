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
async function updateUserData(formData, file) {
    try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            throw new Error("User ID not found in localStorage");
        }

        const { user_name, location, website, bio } = formData;
        const userDocRef = doc(db, 'users', userId);

        await updateDoc(userDocRef, {
            avatar: file,
            user_name,
            location,
            website,
            bio
        });
        localStorage.setItem("user_name", user_name);
        window.location.href = `/${user_name}`;

        console.log('User data updated successfully');
    } catch (error) {
        console.error('Error updating user data: ', error.message);
    }
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
async function deletePostInLibrary(libraryId, indexPost) {
    const userId = localStorage.getItem("user_id")
    const userName = localStorage.getItem("user_name")
    try {

        const userDocumentRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocumentRef);
        const userData = userSnapshot.data();

        if (!userData) {
            throw new Error('No se encontraron datos del usuario');
        }

        const library = userData.libraries.find((lib) => lib.libraryId === libraryId);
        if (!library) {
            throw new Error('No se encontraro la libreria');
        }

        library.posts.splice(indexPost, 1);

        await updateDoc(userDocumentRef, {
            libraries: userData.libraries
        });
        window.location.href = `/${userName}`;
        console.log('Publicación eliminada con éxito');
    } catch (error) {
        console.error('Error elimando la publicación:', error.message);
    }
}
async function updatePostInLibrary(file, title, libraryId, indexPost) {
    const userId = localStorage.getItem("user_id")
    const userName = localStorage.getItem("user_name")
    try {

        const userDocumentRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocumentRef);
        const userData = userSnapshot.data();

        if (!userData) {
            throw new Error('No se encontraron datos del usuario');
        }

        const library = userData.libraries.find((lib) => lib.libraryId === libraryId);
        if (!library) {
            throw new Error('No se encontraro la libreria');
        }

        library.posts[indexPost] = {
            ...library.posts[indexPost],
            titleP: title,
            imageUrl: file
        };
        await updateDoc(userDocumentRef, {
            libraries: userData.libraries
        });
        window.location.href = `/${userName}`;
        console.log('Publicación actualizada con éxito');
    } catch (error) {
        console.error('Error actualizando la publicación:', error.message);
    }
}
async function updateLibraries(librariesTitles) {
    const userId = localStorage.getItem("user_id")
    const userDocumentRef = doc(db, 'users', userId);
    try {
        const doc = await getDoc(userDocumentRef);

        if (doc) {
            const userData = doc.data();
            if (userData.libraries) {
                userData.libraries.forEach((library, index) => {
                    if (librariesTitles[index]) {
                        library.titleL = librariesTitles[index];
                    }
                });

                await updateDoc(userDocumentRef, { libraries: userData.libraries });
                console.log('Bibliotecas actualizadas con éxito:', userData.libraries);
            }
        }

    } catch (error) {
        console.error('Error actualizando la publicación:', error.message);
    }
}
async function deleteLibraryFunction(dataUser, index) {
    const userId = localStorage.getItem("user_id")
    const userName = localStorage.getItem("user_name")
    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDataUserFunction(userName);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const libraries = userData.libraries;

            if (index !== -1) {

                libraries.splice(index, 1);


                await updateDoc(userDocRef, {
                    libraries: libraries
                });
                window.location.href = `/${userName}`;
                console.log(`Library with ID ${index} deleted successfully.`);
            } else {
                console.log(`Library with ID ${index} not found.`);
            }
        } else {
            console.error("User document does not exist.");
        }
    } catch (error) {
        console.error('Error deleting the library:', error);
    }
};

export {
    deleteLibraryFunction,
    updateLibraries,
    deletePostInLibrary,
    updatePostInLibrary,
    updateUserData,
    canEditProfile,
    shuffleArray,
    getAllPosts,
    getDataUserFunction,
    uploadFileFunction,
    createLibraryFunction,
    crearPublicacionFunction,
    findLibrary
};

