import React from 'react';
import {Helmet} from 'react-helmet';

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
      <Helmet
        defaultTitle={site.siteMetadata.title}
        titleTemplate={`%s - ${site.siteMetadata.title}`}
      >
        <meta charSet="utf-8" />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <h1>{site.siteMetadata.title}</h1>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
