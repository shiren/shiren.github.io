import React from 'react';
import {graphql, Link} from 'gatsby';
import {css} from '@emotion/core';

type Props = {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
    allMarkdownRemark: {
      edges: Array<{
        node: {
          id: string;
          frontmatter: {title: string; date: string};
          fields: {
            slug: string;
          };
          excerpt: string;
        };
      }>;
    };
  };
};

const Hello: React.FC<Props> = ({data}) => (
  <div>
    <h1>{data.site.siteMetadata.title}</h1>
    {data.allMarkdownRemark.edges.map(({node}) => (
      <div key={node.id}>
        <Link
          to={node.fields.slug}
          css={css`
            text-decoration: none;
            color: inherit;
          `}
        >
          <h3
            css={css`
              margin-bottom: 10;
            `}
          >
            {node.frontmatter.title}{' '}
            <span
              css={css`
                color: #bbb;
              `}
            >
              — {node.frontmatter.date}
            </span>
          </h3>
          <p>{node.excerpt}</p>
        </Link>
      </div>
    ))}
  </div>
);

export default Hello;

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt(truncate: true, pruneLength: 200)
        }
      }
    }
  }
`;
