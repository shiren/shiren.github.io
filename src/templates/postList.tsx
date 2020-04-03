import React from 'react';
import {graphql} from 'gatsby';

type Props = {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: {
          fields: {
            slug: string;
          };
          frontmatter: {
            title: string;
          };
        };
      }>;
    };
  };
};

const PostList: React.FC<Props> = ({data}) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <div>
      {posts.map(({node}) => {
        const title = node.frontmatter.title || node.fields.slug;

        return <div key={node.fields.slug}>{title}</div>;
      })}
    </div>
  );
};

export default PostList;

export const postListQuery = graphql`
  query postListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: {fields: [frontmatter___date], order: DESC}
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
