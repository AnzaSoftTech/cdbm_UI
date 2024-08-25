import React, { useState } from 'react';
import axios from 'axios';

const FileTypeForm = () => {
  const [selectedRadioOpt, setSelectedRadioOpt] = useState('');

  const handleRadioChange = (event) => {
    setSelectedRadioOpt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (selectedRadioOpt) {
      try {

        const response = await axios.post('/your-api-endpoint', {
          filetype: selectedRadioOpt
        });
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please select a file type.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            name="filetype"
            value="txt"
            checked={selectedRadioOpt === 'txt'}
            onChange={handleRadioChange}
          />
          TXT
        </label>
        <label>
          <input
            type="radio"
            name="filetype"
            value="csv"
            checked={selectedRadioOpt === 'csv'}
            onChange={handleRadioChange}
          />
          CSV
        </label>
        <label>
          <input
            type="radio"
            name="filetype"
            value="ftp"
            checked={selectedRadioOpt === 'ftp'}
            onChange={handleRadioChange}
          />
          FTP
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FileTypeForm;
