import React from 'react';
import styled from '@emotion/styled';

import {graphql} from 'gatsby';

const Layout: React.FC = ({children}) => {
  return (
    <div>
      <nav>메뉴</nav>
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
