import React from 'react';
import {graphql} from 'gatsby';

import PostList from '../components/postList';

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

const Main: React.FC<Props> = ({data}) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <div>
      <h1>{data.site.siteMetadata.title}</h1>
      <PostList posts={posts} />
    </div>
  );
};

export default Main;

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: {fields: [frontmatter___date], order: DESC}
      limit: 6
      skip: 0
    ) {
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
