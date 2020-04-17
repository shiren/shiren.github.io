import React from 'react';
import {graphql, Link} from 'gatsby';

import PostList from '../components/postList';
import Pagination from '../components/pagination';

type Props = {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
    allMarkdownRemark: {
      totalCount: number;
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
  // const posts = data.allMarkdownRemark.edges;

  const {
    allMarkdownRemark: {totalCount, edges: posts},
  } = data;

  return (
    <div>
      <h1>{data.site.siteMetadata.title}</h1>
      <PostList posts={posts} />
      <Pagination total={totalCount} current={1} />
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
