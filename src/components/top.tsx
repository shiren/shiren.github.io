import React from 'react';
import styled from '@emotion/styled';

import {graphql} from 'gatsby';

const Top: React.FC = () => {
  return <Wrapper></Wrapper>;
};

const Wrapper = styled.nav`
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  min-height: 50px;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
  background: #f5f6f6;
`;

export default Top;
