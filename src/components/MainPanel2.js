import React from 'react';

const MainPanel2 = ({ page }) => {
  return (
    <div className="main-panel">
      {page === 'page1' && <div>Welcome to Page 1</div>}
      {page === 'page2' && <div>Welcome to Page 2</div>}
      {page === 'page3' && <div>Welcome to Page 3</div>}
    </div>
  );
};

export default MainPanel2;
