import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Table from './Table';
import { TextField, Box } from '@mui/material';

const Search = () => {
    const { data } = useContext(DataContext);
    const [query, setQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(data); // Update filteredData when data changes
    }, [data]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        const results = data.filter(record => 
            Object.values(record).some(val => 
                val.toString().toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilteredData(results);
    };

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <TextField
                value={query}
                onChange={handleSearch}
                label="Search"
                fullWidth
                variant="outlined"
            />
            <Table data={filteredData} />
        </Box>
    );
};

export default Search;
