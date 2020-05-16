import React from 'react';
import styled from 'styled-components';

import 'normalize.css';
import '../../assets/style.css';

import {graphql} from 'gatsby';

import Top from './top';

const Layout: React.FC = ({children}) => {
  return (
    <div>
      <Top />
      <Container>
        <div>{children}</div>
      </Container>
      <footer>푸터</footer>
    </div>
  );
};

const Container = styled.div`
  margin: 0 auto;
  width: 750px;
`;

export default Layout;
