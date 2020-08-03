import React from 'react';
import styled from 'styled-components';

import Top from './top';
import Footer from './footer';

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Top />
      <Container>
        <div>{children}</div>
      </Container>
      <Footer />
    </div>
  );
};

const Container = styled.div`
  margin: 120px auto 0;
  width: 750px;
  padding: 0 15px;
  box-sizing: border-box;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

export default Layout;
