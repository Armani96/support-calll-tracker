import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await axios.get('http://192.168.178.227:5001/records');
            setRecords(response.data.records);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const addRecord = async (newRecord) => {
        try {
            const timestamp = new Date().toISOString();
            const response = await axios.post('http://192.168.178.227:5001/records', { ...newRecord, timestamp });
            setRecords([...records, response.data]);
        } catch (error) {
            console.error('Error adding record:', error);
        }
    };

    const updateRecord = async (updatedRecord) => {
        try {
            const response = await axios.put(`http://192.168.178.227:5001/records/${updatedRecord.id}`, updatedRecord);
            setRecords(records.map(record => record.id === updatedRecord.id ? response.data : record));
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const deleteRecord = async (id) => {
        try {
            await axios.delete(`http://192.168.178.227:5001/records/${id}`);
            setRecords(records.filter(record => record.id !== id));
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const sortedRecords = () => {
        let sortableRecords = [...records];
        if (sortConfig.key !== null) {
            sortableRecords.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableRecords.filter(record =>
            Object.values(record).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <DataContext.Provider value={{ records: sortedRecords(), addRecord, updateRecord, deleteRecord, requestSort, setSearchTerm }}>
            {children}
        </DataContext.Provider>
    );
};
