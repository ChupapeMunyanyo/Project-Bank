import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>SimpleBank Subgraph Demo</h1>
      <p>
        Тестовое задание для позиции Senior Software Engineer – On-Chain Development в D3 Development
      </p>
    </header>
  );
};

export default React.memo(Header);