import React, { useContext, useState, useEffect, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import { TableContainer, Table as MuiTable, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Collapse, Box, Typography, Dialog, DialogTitle, DialogContent, Tooltip, TextField, Button, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditPopup from './EditPopup';
import './Table.css';
import axios from 'axios';

const Table = () => {
    const { deleteRecord } = useContext(DataContext);
    const [records, setRecords] = useState([]);
    const [open, setOpen] = useState({});
    const [editRecord, setEditRecord] = useState(null);
    const [dialogContent, setDialogContent] = useState({ title: '', content: '' });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [callbackDialogOpen, setCallbackDialogOpen] = useState(false);
    const [callbackContent, setCallbackContent] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchRecords = useCallback(async () => {
        try {
            const response = await axios.get('http://192.168.178.227:5001/records');
            setRecords(response.data.records);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
        const intervalId = setInterval(fetchRecords, 3000); // Fetch records every 3 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [fetchRecords]);

    const handleToggle = (id) => {
        setOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));
    };

    const handleEdit = (record) => {
        setEditRecord(record);
    };

    const handleClose = () => {
        setEditRecord(null);
    };

    const handleDialogOpen = (title, content) => {
        setDialogContent({ title, content });
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleCallbackDialogOpen = (record) => {
        const content = `
        Terugbelverzoek.
        Customer Name: ${record.customerName}
        Status: ${record.opgelostDoorgezet ? 'Opgelost' : 'Doorgezet'}
        Probleem: ${record.probleem}
        Oplossing: ${record.oplossing}
        Note: ${record.note}
        Call Back Required: Yes
        Waiting for Email: ${record.waitingForEmail ? 'Yes' : 'No'}
        Created By: ${record.createdBy}
        Last Edited By: ${record.lastEditedBy}
        Timestamp: ${formatDate(record.timestamp)}
        `;
        setCallbackContent(content);
        setCallbackDialogOpen(true);
    };

    const handleCallbackDialogClose = () => {
        setCallbackDialogOpen(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(callbackContent);
    };

    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    const sortedRecords = React.useMemo(() => {
        let sortableRecords = [...records];
        if (sortConfig.key) {
            sortableRecords.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (sortConfig.key === 'timestamp') {
                    return sortConfig.direction === 'asc'
                        ? new Date(aValue) - new Date(bValue)
                        : new Date(bValue) - new Date(aValue);
                }

                if (sortConfig.key === 'id') {
                    return (sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue);
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableRecords;
    }, [records, sortConfig]);

    const filteredRecords = sortedRecords.filter(record =>
        Object.values(record).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const requestSort = key => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getColor = (record) => {
        if (record.completed) {
            return '#2ECC71'; // green
        }
        if (record.opgelostDoorgezet) {
            return '#F39C12'; // yellow
        }
        if (record.callBackRequired) {
            return '#5DADE2'; // blue
        }
        if (record.waitingForEmail) {
            return '#95A5A6'; // red
        }
        return '#34495E'; // default
    };

    // Export data to CSV with company names and their count
    const exportData = () => {
        const companyCounts = {};

        // Count occurrences of each company
        records.forEach(record => {
            if (companyCounts[record.customerName]) {
                companyCounts[record.customerName]++;
            } else {
                companyCounts[record.customerName] = 1;
            }
        });

        const csvRows = [];
        // Headers
        csvRows.push(["Company Name", "Count"].join(','));

        // Records
        Object.entries(companyCounts).forEach(([companyName, count]) => {
            csvRows.push([companyName, count].join(','));
        });

        // Create a blob for the CSV file
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "company_data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!records || !Array.isArray(records)) {
        return <Typography>No data available</Typography>;
    }

    return (
        <>
            <Button variant="contained" onClick={exportData} style={{ marginBottom: '20px' }}>
                Export Data
            </Button>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={e => setSearchTerm(e.target.value)}
            />
            <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
                <MuiTable sx={{ minWidth: '100%', tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{ width: '5%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('id')}></TableCell>
                            <TableCell sx={{ width: '10%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('customerName')}>Company</TableCell>
                            <TableCell sx={{ width: '10%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('opgelostDoorgezet')}>Status</TableCell>
                            <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('probleem')}>Probleem</TableCell>
                            <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('oplossing')}>Oplossing</TableCell>
                            <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('note')}>Note</TableCell>
                            <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('verbeterPunten')}>Verbeter punten</TableCell>
                            <TableCell sx={{ width: '10%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('callBackRequired')}>Callback Required</TableCell>
                            <TableCell sx={{ width: '10%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('waitingForEmail')}>Waiting for Email</TableCell>
                            <TableCell sx={{ width: '15%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('timestamp')}>Timestamp</TableCell>
                            <TableCell sx={{ width: '10%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('createdBy')}>Created By</TableCell>
                            <TableCell sx={{ width: '10%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => requestSort('lastEditedBy')}>Last Edited By</TableCell>
                            <TableCell sx={{ width: '5%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{records.length && records[0].completed ? <CheckIcon sx={{ color: 'green' }} /> : <CloseIcon sx={{ color: 'red' }} />}</TableCell>
                            <TableCell sx={{ width: '10%' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record, index) => (
                            <React.Fragment key={record.id}>
                                <TableRow
                                    className={`table-row ${open[record.id] ? 'table-row-expanded' : ''}`}
                                    style={{ backgroundColor: getColor(record) }}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#555',
                                            cursor: 'pointer'
                                        }
                                    }}
                                >
                                    <TableCell>
                                        <IconButton onClick={() => handleToggle(record.id)}>
                                            {open[record.id] ? <KeyboardArrowUpIcon color="primary" /> : <KeyboardArrowDownIcon color="primary" />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ width: '5%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}></TableCell>
                                    <TableCell>
                                        <Tooltip title={record.customerName}>
                                            <span onClick={() => handleDialogOpen('Customer Name', record.customerName)}>
                                                {truncateText(record.customerName, 20)}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{record.opgelostDoorgezet ? 'Opgelost' : 'Doorgezet'}</TableCell>
                                    <TableCell>
                                        <Tooltip title={record.probleem}>
                                            <span onClick={() => handleDialogOpen('Probleem', record.probleem)}>
                                                {truncateText(record.probleem, 30)}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={record.oplossing}>
                                            <span onClick={() => handleDialogOpen('Oplossing', record.oplossing)}>
                                                {truncateText(record.oplossing, 30)}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={record.note}>
                                            <span onClick={() => handleDialogOpen('Note', record.note)}>
                                                {truncateText(record.note, 30)}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={record.verbeterPunten}>
                                            <span onClick={() => handleDialogOpen('Verbeter punten', record.verbeterPunten)}>
                                                {truncateText(record.verbeterPunten, 30)}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell onClick={() => handleCallbackDialogOpen(record)} sx={{ cursor: 'pointer' }}>{record.callBackRequired ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{record.waitingForEmail ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{formatDate(record.timestamp)}</TableCell>
                                    <TableCell>{record.createdBy}</TableCell>
                                    <TableCell>{record.lastEditedBy}</TableCell>
                                    <TableCell>{record.completed ? <CheckIcon sx={{ color: 'green' }} /> : <CloseIcon sx={{ color: 'red' }} />}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(record)}>
                                            <EditIcon sx={{ color: '#ffbe0b' }} />
                                        </IconButton>
                                        <IconButton onClick={() => deleteRecord(record.id)}>
                                            <DeleteIcon sx={{ color: 'red' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
                                        <Collapse in={open[record.id]} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Details
                                                </Typography>
                                                <Typography variant="body2">Probleem: {record.probleem}</Typography>
                                                <Typography variant="body2">Oplossing: {record.oplossing}</Typography>
                                                <Typography variant="body2">Note: {record.note}</Typography>
                                                <Typography variant="body2">Verbeter punten: {record.verbeterPunten}</Typography>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </MuiTable>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRecords.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            {editRecord && <EditPopup open={Boolean(editRecord)} handleClose={handleClose} record={editRecord} />}
            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md">
                <DialogTitle>{dialogContent.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">{dialogContent.content}</Typography>
                </DialogContent>
            </Dialog>
            <Dialog open={callbackDialogOpen} onClose={handleCallbackDialogClose} fullWidth maxWidth="md">
                <DialogTitle>Callback Request</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                        {callbackContent}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="contained" startIcon={<ContentCopyIcon />} onClick={copyToClipboard}>
                            Copy
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Table;
