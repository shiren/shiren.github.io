import React from 'react';
import {graphql} from 'gatsby';

import PostList from '../components/postList';

type Props = {
  data: {
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

const PostListPage: React.FC<Props> = ({data}) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
};

export default PostListPage;

export const postListQuery = graphql`
  query postListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: {fields: [frontmatter___date], order: DESC}
      limit: $limit
      skip: $skip
    ) {
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
