import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './MII_Master.css'; 
import './PopupCss.css';
import { format,parseISO } from 'date-fns'; 
import { BASE_URL } from ".././constants";

function MII_Segments({ onCloseClick, p_MII_code, p_User_Id }) {

const [segment, setSegment] = useState();
const [segments, setSegments] = useState([]);
const [header, setHeader] = useState({});

const [segmentData, setSegmentData] = useState([{ segment:'', exist: 'F' }]);

 useState( async () => {
        //console.log('details', details);

        try {
            const response = await axios.get(`${BASE_URL}/api/get_mii_segments`, {
                params: {
                    p_MII_Code: p_MII_code
                }
            });

            if (response) {
                const segmentList = response.data.map(seg => {
                    return {
                        segment: seg.seg_code || '',
                        exist: seg.exist || '',
                    };
                });
                // console.log('contact person contpersonList --->>>> ', contpersonList);
                setSegmentData(segmentList);
                // console.log('response.data => ', response.data);
                // console.log('segmentList => ', segmentList);
            }
            else 
            {
                if (segmentData.length === 0) {
                    setSegmentData([{ segment: '', exist:'F' }]);
                }
            }
           
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }

        
    });

    useEffect(() => {
        axios.get(`${BASE_URL}/api/get_segment`)
            .then(response => setSegments(response.data))
            .catch(error => console.error('Error fetching segment:', error));
    }, []);

const handleInputChange = (index, field, value) => {
    const updatedData = [...segmentData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setSegmentData(updatedData);
};

const handleAddRow = () => {
    setSegmentData([...segmentData, { segment:'', exist:'F' }]);
};

const handleFinalSave = () => {

    const isConfirmed = window.confirm("Sure you want to save the records ?");

    if (!isConfirmed) {
        return;
    }

    const headerData = {
        p_MII_code, 
        userId: p_User_Id,
    };
    setHeader(headerData);
    const data = {
        header: headerData,
        details: segmentData,
    };

    axios.post(`${BASE_URL}/api/save_mii_segments`, data)
        .then(response => {
            alert('Segments saved successfully!')});
}

const columns = [

    {
        name: 'Segment',
        selector: row => row.segment,
        cell: (row, index) => (
            <select
                value={row.segment}
                onChange={e => handleInputChange(index, 'segment', e.target.value)}
                className="form-control">
                <option value="">Select Segment</option>
                {segments.map(seg => (
                    <option key={seg.seg_code} value={seg.seg_code}>{seg.seg_name}</option>
                ))}
            </select>
        ),
        width: '500px',
    },

];
const customStyles = {
    header: {
        style: {
            minHeight: '56px',

        },
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: 'purple',
            backgroundColor: '#99bcef',
            color: 'black',
            fontWeight: 'bold',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            minHeight: '40px',
            paddingLeft: '3px',
            paddingRight: '3px',
        },
    },
    headCells: {
        style: {
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderRightColor: 'black',
            paddingLeft: '3px',
            paddingRight: '3px', // Adjust padding as needed
            // Include other styles as needed
        },
    },
    cells: {
        style: {
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderRightColor: 'blue',
            paddingLeft: '3px',
            paddingRight: '3px', // Adjust padding as needed
            // Include other styles as needed
        },
    },
    rows: {
        style: {
            paddingLeft: '3px',
            paddingRight: '3px', // Adjust padding as needed
            // Include other styles as needed
        },
    },
    actionsHeader: {
        style: {
            borderRightStyle: 'none', // Remove border-right for Actions column header
        },
    },
    // Specific styles for Actions column cells
    actionsCell: {
        style: {
            borderRightStyle: 'none', // Remove border-right for Actions column cells
            paddingLeft: '3px',
            paddingRight: '3px', // Ensure padding remains consistent
        },
    },
};


return (
    <div className="popup_addr_cont">
        {/* <div className="popup-inner"> */}
        <div className='div_header_warn'>
                <h5 className='search_header '>MII Segments</h5>
            </div>
            <div className="card-body">

                <div className="row">
                <div className='mt-2'>
                        <div style={{ border: '1px solid #ccc', margin: '5px 5px 0px 5px' }}>
                            {/* <h5 className='text-center label_color'>Allocation Details</h5> */}
                            {/* <input id="test" value={test}></input> */}
                              {/* <div className='table-container'> */}
                                 <DataTable
                                    columns={columns}
                                    data={segmentData}
                                    responsive
                                    highlightOnHover
                                    customStyles={customStyles}
                                    noDataComponent={<div>No data available</div>}
                                /> 
                            {/* </div>   */}
                            <div className='d-flex justify-content-end me-2'>
                                <button className="btn btn-warning" onClick={handleAddRow}>Add Row</button> &nbsp;
                                <button className='btn btn-danger' style={{width:'100px'}} onClick={() => onCloseClick(null)}>Close</button> &nbsp;
                                <button className="btn btn-success" style={{width:'100px', height:'40px'}} onClick={handleFinalSave}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/* </div> */}
    </div>
);

}

export default MII_Segments;