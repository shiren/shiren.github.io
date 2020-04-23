import React from 'react';

import {useStaticQuery, graphql} from 'gatsby';

const Layout: React.FC = ({children}) => {
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
    <div style={{margin: `0 auto`, maxWidth: 650, padding: `0 1rem`}}>
      <h1>{site.siteMetadata.title}</h1>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
