import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';
import { graphql, useStaticQuery } from 'gatsby';

type Props = {
  title?: string;
  date?: string;
  description?: string;
  image?: string;
  article?: boolean;
};

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        titleTemplate
        defaultDescription: description
        siteUrl: url
        defaultImage: image
        sns {
          twitter
        }
        ownerName
        ownerNickname
      }
    }
  }
`;

const SEO: React.FC<Props> = ({ title, description, image, date = '', article = false }) => {
  const { pathname } = useLocation();
  const { site } = useStaticQuery(query);

  const {
    defaultTitle,
    titleTemplate,
    defaultDescription,
    siteUrl,
    defaultImage,
    ownerName,
    sns: { twitter },
  } = site.siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${image?.includes('http') ? '' : siteUrl}${image ?? defaultImage}`,
    url: `${siteUrl}${pathname}`,
  };

  // @ts-ignore
  return (
    <Helmet title={seo.title} titleTemplate={titleTemplate}>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta name="author" content={`${ownerName}`} />
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      {seo.url && <meta property="og:url" content={seo.url} />}
      <meta property="og:type" content="article" />
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && <meta property="og:description" content={seo.description} />}
      {seo.image && <meta property="og:image" content={seo.image} />}
      {seo.image && <meta property="image" content={seo.image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {twitter && <meta name="twitter:creator" content={twitter} />}
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.description && <meta name="twitter:description" content={seo.description} />}
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      {article && (
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "${seo.title}",
              "image": [
                "${seo.image}" 
              ],
              "datePublished": "${new Date(Date.parse(date)).toISOString()}",
              "test": 1
            }
          `}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
