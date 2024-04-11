import React, { useState, useEffect } from 'react';

const initialFilters = {
    noteType: '',
    category: '',
    university: '',
    subject: '',
    country: '',
    minRating: 0,
};

const Search = ({ data, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(initialFilters);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value,
        });
    };

    const handleRatingChange = (event) => {
        setFilters({
            ...filters,
            minRating: parseInt(event.target.value),
        });
    };
    const cardStyle = {
        backgroundColor: "#f2f3f5"
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        onFilterChange({ searchTerm, ...filters }); // Pass all filters to parent component
    };

    // Function to filter data based on search term and filters
    const filteredData = useEffect(() => {
        if (!data) return; // Early return if data is undefined

        const filtered = data.filter((item) => {
            let matches = true;

            // Search term filtering
            if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                matches = false;
            }

            // Filter by note type, category, etc.
            Object.entries(filters).forEach(([filterName, filterValue]) => {
                if (filterValue && item[filterName] !== filterValue) {
                    matches = false;
                }
            });

            // Filter by minimum rating
            if (filters.minRating > 0 && item.averageRating < filters.minRating) {
                matches = false;
            }

            return matches;
        });

        onFilterChange(filtered); // Pass filtered data to parent component
    }, [searchTerm, filters, data, onFilterChange]);
    return (
        <div className="d-flex justify-content-center">
            <div className="card text-center w-100" style={cardStyle}>
                <form className="search-bar" onSubmit={handleSubmit}>
                    <div className="search-input">
                        <input type="text"
                            placeholder="Search for notes..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="filters">
                        <select name="noteType" value={filters.noteType} onChange={handleFilterChange}>
                            <option value="">All Note Types</option>
                            <option value="Handwritten">Handwritten</option>
                            <option value="University">University</option>
                            <option value="Notebook">Notebook</option>
                            <option value="Novel">Novel</option>

                        </select>
                        <select name="category" value={filters.category} onChange={handleFilterChange}>
                            <option value="">All Categories</option>
                            <option value="IT">IT</option>
                            <option value="CA">CA</option>
                            <option value="CS">CS</option>
                            <option value="MBA">MBA</option>
                            {/* Add more categories as needed */}
                        </select>
                        <input
                            type="text"
                            name="university"
                            placeholder="University"
                            value={filters.university}
                            onChange={handleFilterChange}
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject/Course"
                            value={filters.subject}
                            onChange={handleFilterChange}
                        />
                        <select name="country" value={filters.country} onChange={handleFilterChange}>
                            <option value="">All Countries</option>
                            <option value="USA">USA</option>
                            <option value="India">India</option>
                            <option value="UK">UK</option>
                            {/* Add more countries as needed */}
                        </select>
                        <div className="rating-filter">
                            <label htmlFor="minRating">Minimum Rating:</label>
                            <select name="minRating" id="minRating" value={filters.minRating} onChange={handleRatingChange}>
                                <option value="0">All Ratings</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>)

}

export default Search
