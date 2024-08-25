import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Label} from 'react'

function SearchTab1 ({ setSearchResults })  {
    const [branches, setbranches] = useState([]);
    const [settlenum, setSettlenum] = useState('');
    const [scrip, setScrip] = useState('');

  	useEffect(() => {
		axios.get('http://localhost:3004/api/branches')
			.then(response => {
				setbranches(response.data);
				// alert(response.data);
			})
			.catch(error => {
				console.error("There was an error fetching the data!", error);
			});
	},
		[]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3004/api/Sauda_book', {
        params: { settlenum, scrip }
      });      
      alert(JSON.stringify(response.data));
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results', error);
    }
  };


  return (
    <div>
    <div>
    <Label for="trade_user_id" className='label_width'>Branch:</Label>
												<select className='margin_before_select margin_left'>
													{branches.map(branch => (<option key={branch.branch_cd} defaultValue={branch.branch_cd}>{branch.branch_name}</option>))}
												</select>
    </div>
      <input
        type="text"
        placeholder="Settlement Number"
        value={settlenum}
        onChange={(e) => setSettlenum(e.target.value)}
      />
      <input
        type="text"
        placeholder="Scrip"
        value={scrip}
        onChange={(e) => setScrip(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchTab1