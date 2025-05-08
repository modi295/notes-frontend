import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';


const NotesGrid = () => {
    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [universityType, setUniversityType] = useState('')
    const [categoryType, setCategoryType] = useState('')
    const [notesType, setNotesType] = useState('')
    const [countryType, setCountryType] = useState('')
    const [supportImage, setSupportImage] = useState(null);
    const [distinctUniversities, setDistinctUniversities] = useState([]);
    const [distinctCategory, setDistinctCategory] = useState([]);
    const [distinctNotesType, setDistinctNotesType] = useState([]);
    const [distinctCountry, setDistinctCountry] = useState([]);

    const notesPerPage = 6;

    const getNotes = async () => {
        try {
          const url = `/allpublishNotes`;
          const response = await api.get(url);
          const data = response.data;
      
          setNotes(data);
      
          const universities = [...new Set(data.map(note => note.universityInformation))];
          setDistinctUniversities(universities);
          const categories = [...new Set(data.map(note => note.category))];
          setDistinctCategory(categories);
          const noteType = [...new Set(data.map(note => note.notesType))];
          setDistinctNotesType(noteType);
          const country = [...new Set(data.map(note => note.country))];
          setDistinctCountry(country);
        } catch (error) {
          console.error('Error fetching notes:', error);
        }
      };
      
    const fetchSupportInfo = async () => {
        try {
            const response = await api.get('/support');
            setSupportImage(response.data.noteImage); // Assuming the field is named noteImage
        } catch (error) {
            console.error('Error fetching support info:', error);
        }
    };
    


    useEffect(() => {
        getNotes();
        fetchSupportInfo();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleUniversityChange = (event) => {
        setUniversityType(event.target.value);
    };
    const handleCategoryChange = (event) => {
        setCategoryType(event.target.value);
    };
    const handleNotesTypeChange = (event) => {
        setNotesType(event.target.value);
    };
    const handleCountryChange = (event) => {
        setCountryType(event.target.value);
    };
    const handleChangePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleCardClick = (id) => {
        navigate(`/viewNotes/${id}`);
    };

    const generateAverageRatingStars = (averageRating) => {
        if (averageRating === null || averageRating === undefined) {
            return 'No Ratings';
        }
        const roundedRating = Math.round(averageRating);
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < roundedRating ? '★' : '☆';
        }
        return <span style={{ color: '#deeb34',fontSize:'24px' }}>{stars}</span>;
    };

    const filteredNotes = notes.filter((note) => {
        const titleMatch = note.noteTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const universityMatch = !universityType || note.universityInformation === universityType;
        const categoryMatch = !categoryType || note.category === categoryType;
        const notesTypeMatch = !notesType || note.notesType === notesType;
        const countryMatch = !countryType || note.country === countryType;
        return titleMatch && universityMatch && categoryMatch && notesTypeMatch && countryMatch;
    });

    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

    const paginate = () => {
        const pageNumbers = [];
        const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <ul className="pagination justify-content-center">
                {pageNumbers.map((pageNumber) => (
                    <li
                        key={pageNumber}
                        className={currentPage === pageNumber ? 'page-item active' : 'page-item'}
                    >
                        <button
                            onClick={() => handleChangePage(pageNumber)}
                            className="page-link"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                textDecoration: 'none',
                            }}
                        >
                            {pageNumber}
                        </button>
                    </li>

                ))}
            </ul>
        );
    };

    return (
        <div>
            <div className="search-filter">
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                    <div style={{ position: 'relative', width: '75%' }}>
                        <img src="/search-icon.png" alt="Search Icon" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', zIndex: '1' }} />
                        <input
                            type="text"
                            className='w-90 form-control'
                            placeholder="Search notes here..."
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ paddingLeft: '30px' }} 
                        />
                    </div>
                </div>

                <div className="filter-options d-flex justify-content-between px-10" style={{ padding: '10px 80px 20px 80px' }}>

                    <div className="custom-select-wrapper" style={{ position: 'relative', width: '100%' }}>
                        <select className="form-control" value={universityType} onChange={handleUniversityChange} style={{ paddingRight: '30px' }}>
                            <option value="">Select University</option>
                            {distinctUniversities.map((university, index) => (
                                <option key={index} value={university}>{university}</option>
                            ))}
                        </select>
                        <img src="/arrow-down.png" alt="Arrow Down Icon" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', zIndex: '1' }} />
                    </div>
                    <div className="custom-select-wrapper" style={{ position: 'relative', width: '100%' }}>
                        <select className="form-control" value={notesType} onChange={handleNotesTypeChange}>
                            <option value="">Select Type</option>
                            {distinctNotesType.map((notesType, index) => (
                                <option key={index} value={notesType}>{notesType}</option>
                            ))}
                        </select>
                        <img src="/arrow-down.png" alt="Arrow Down Icon" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', zIndex: '1' }} />
                    </div>

                    <div className="custom-select-wrapper" style={{ position: 'relative', width: '100%' }}>
                        <select className="form-control" value={categoryType} onChange={handleCategoryChange}>
                            <option value="">Select category</option>
                            {distinctCategory.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <img src="/arrow-down.png" alt="Arrow Down Icon" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', zIndex: '1' }} />
                    </div>

                    <div className="custom-select-wrapper" style={{ position: 'relative', width: '100%' }}>
                        <select className="form-control" value={countryType} onChange={handleCountryChange}>
                            <option value="">Select Country</option>
                            {distinctCountry.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                        <img src="/arrow-down.png" alt="Arrow Down Icon" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', zIndex: '1' }} />
                    </div>
                </div>


            </div>
            <div className="product-cards">
                {currentNotes.map((note) => (
                    <div className="product-card" key={note.id} onClick={() => handleCardClick(note.id)} style={{ cursor: 'pointer' }}>
                        <img   src={note.displayPictureP ? note.displayPictureP : supportImage}  alt={note.noteTitle} style={{ width: '100%', height: '250px' }} />
                        <div className="product-info">
                            <h4>{note.noteTitle}</h4>
                            <p><img src='/university.png' alt='university' /> <span style={{ marginLeft: '10px' }}>{note.universityInformation}</span></p>
                            <p><img src='/pages.png' alt='pages' /> <span style={{ marginLeft: '15px' }}>{note.numberOfPages} pages</span></p>
                            <p><img src='/date.png' alt='date' /> <span style={{ marginLeft: '20px' }}>{new Date(note.updatedAt).toLocaleDateString()}</span></p>
                            <p><img src='/flag.png' alt='flag' /> <span style={{ marginLeft: '25px', color: 'red' }}>{note.reportCount} user marked this notes as inappropriate</span></p>
                            <p style={{ margin: '0' }}>{generateAverageRatingStars(note.averageRating)} {note.averageRating !== null && note.averageRating !== undefined ? `${note.averageRating} Ratings` : ''}
</p>
                        </div>

                    </div>
                ))}
            </div>
            <div className="pagination-container">{paginate()}</div>
        </div>
    );
};

export default NotesGrid;
