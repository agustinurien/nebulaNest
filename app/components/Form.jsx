import React, { useEffect, useState } from 'react'
import { manrope } from '../fonts';
import { updateUserData, uploadFileFunction } from '../functions/data';
import { CgEnter } from 'react-icons/cg';
import Image from 'next/image';
import { MdModeEdit } from 'react-icons/md';

const Form = ({ dataUser }) => {
    const countries = [
        "Argentina", "Australia", "Brazil", "Canada", "China", "France", "Germany",
        "India", "Japan", "Mexico", "Russia", "South Africa", "United Kingdom", "United States"
    ];

    const [formData, setFormData] = useState({
        avatar: '',
        user_name: '',
        location: '',
        website: '',
        bio: ''
    });

    const [wordCount, setWordCount] = useState(0);
    const [error, setError] = useState('');
    const [changeImage, setChangeImage] = useState(false);
    const [file, setFile] = useState();

    useEffect(() => {
        if (dataUser) {
            setFormData({
                avatar: dataUser.avatar || '',
                user_name: dataUser.user_name || '',
                location: dataUser.location || '',
                website: dataUser.website || '',
                bio: dataUser.bio || ''
            });
            setWordCount(dataUser.bio ? dataUser.bio.split(' ').filter(word => word !== '').length : 0);
        }
    }, [dataUser]);

    const handleChangeImage = () => {
        document.getElementById('fileInput').click()
    };
    const uploadFile = async (file) => {
        const result = await uploadFileFunction(file)
        setFile(result)
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'bio') {
            const wordArray = value.split(' ').filter(word => word !== '');
            if (wordArray.length <= 500) {
                setFormData({ ...formData, [name]: value });
                setWordCount(wordArray.length);
                setError('');
            } else {
                setError('La bio no puede exceder los 500 palabras');
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserData(formData, file);
            // Aquí puedes llamar a la función updateUserData(formData) para actualizar los datos del usuario
        } catch (error) {
            console.error('Error submitting form: ', error);
        }
    };
    const redirect = () => {
        window.location.href = `/${dataUser.user_name}`;
    };

    return (
        <div className={`${manrope.className} containerForm`}>
            <form onSubmit={handleSubmit} className={`${manrope.className} form`}>
                <div className='basicInfoEdit'>
                    <div
                        onMouseOver={() => setChangeImage(true)}
                        onMouseOut={() => setChangeImage(false)}
                        style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 104,
                            height: 104,
                            borderRadius: "100%",
                            backgroundColor: `${dataUser?.color}`
                        }}>
                        {
                            formData.avatar || file ?
                                <Image
                                    src={file ? file : formData.avatar}
                                    width={1000}
                                    height={1000}
                                    alt='avatar'
                                    className='avatarEdit'
                                    style={{
                                        borderRadius: "100%"
                                    }}
                                />
                                :
                                <h2 style={{ color: "white" }}>{formData.user_name.charAt(0).toUpperCase()}</h2>
                        }
                        {
                            changeImage &&
                            <div
                                onClick={handleChangeImage}
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.377)",
                                    width: "100%",
                                    height: "100%",
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: "center",
                                    borderRadius: "100%"
                                }}>
                                <MdModeEdit fontSize={39} color='white' />
                                <input id="fileInput" type="file" onChange={(e) => uploadFile(e.target.files[0])} style={{ display: 'none' }} />
                            </div>
                        }

                    </div>
                    <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        className={`${manrope.className}`}
                    />
                </div>
                <div className='moreInfoEdit'>
                    <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    >
                        <option value="">Select your country</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>{country}</option>
                        ))}
                    </select>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className={`${manrope.className}`}
                    />
                    <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleChange}
                        className={`${manrope.className}`}
                    />
                    <div>
                        <span>{wordCount} / 500 palabras</span>
                    </div>
                    {error && <p className="error">{error}</p>}
                </div>
                <div style={{ width: "75%", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button className={`${manrope.className} done`} type="submit">Done</button>
                    <button className={`${manrope.className} done cancel`} onClick={() => redirect()} type="button">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default Form;