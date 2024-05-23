import React, { useState } from 'react'
import { manrope } from '../fonts';

const Form = () => {

    const countries = [
        "Argentina", "Australia", "Brazil", "Canada", "China", "France", "Germany",
        "India", "Japan", "Mexico", "Russia", "South Africa", "United Kingdom", "United States"
    ];
    const [formData, setFormData] = useState({
        username: '',
        profession: '',
        location: '',
        website: '',
        bio: ''
    });

    const [wordCount, setWordCount] = useState(0);
    const [error, setError] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);
    };

    return (
        <div className={`${manrope.className} containerForm`}>
            <form onSubmit={handleSubmit} className={`${manrope.className} form`}>


                <div className='basicInfoEdit'>
                    <div style={{ width: 104, height: 104, borderRadius: "100%", backgroundColor: "violet" }}></div>

                    <input

                        type="text"
                        id="username"
                        name="username"
                        placeholder="Nombre de Usuario"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className={`${manrope.className}`}
                    />



                </div>
                <div className='moreInfoEdit'>


                    <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona tu país</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>{country}</option>
                        ))}
                    </select>


                    <input
                        type="url"
                        id="website"
                        name="website"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={handleChange}
                        required
                        className={`${manrope.className} `}
                    />



                    <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        placeholder="About you..."
                        value={formData.bio}
                        onChange={handleChange}
                        required
                        className={`${manrope.className}`}
                    />
                    <div>
                        <span>{wordCount} / 500 palabras</span>
                    </div>
                    {error && <p className="error">{error}</p>}
                </div>
                <div style={{ width: "75%", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button className={`${manrope.className} done`} type="submit">Done</button>
                    <button className={`${manrope.className} done cancel`} >cancel</button>
                </div>
            </form>
        </div>
    );
};

export default Form;
