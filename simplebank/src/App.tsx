import React, { memo } from 'react';
import Header from './components/Header'
import ContractInteraction from './components/Contract';
import SubgraphInfo from './components/SubgraphInfo';
import GraphQLQuery from './components/GraphQL';
import './styles.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="content">
        <section className="section">
          <ContractInteraction />
        </section>
        <section className="section">
          <SubgraphInfo />
        </section>
        <section className="section">
          <GraphQLQuery />
        </section>
      </main>
    </div>
  );
};

export default memo(App);