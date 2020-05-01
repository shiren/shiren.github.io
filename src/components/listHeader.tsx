import React from 'react';
import styled from '@emotion/styled';
import {Helmet} from 'react-helmet';

import {useStaticQuery, graphql} from 'gatsby';

const ListHeader: React.FC = ({children}) => {
  const {site} = useStaticQuery(
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
      <h1>{site.siteMetadata.title}</h1>
    </header>
  );
};

export default styled(ListHeader)`
  margin: 0 auto;
  width: 750px;
`;
