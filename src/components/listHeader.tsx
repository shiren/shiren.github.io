import React from 'react';
import styled from 'styled-components';

import {graphql, useStaticQuery} from 'gatsby';

const ListHeader: React.FC = ({ children }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  return (
    <header>
      <h1>Hello</h1>
    </header>
  );
};

export default styled(ListHeader)`
  margin: 0 auto;
  width: 750px;
`;
