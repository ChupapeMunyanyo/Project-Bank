import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>SimpleBank Subgraph Demo</h1>
    </header>
  );
};

export default React.memo(Header);
