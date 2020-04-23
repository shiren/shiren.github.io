import React from 'react';
import {graphql} from 'gatsby';

import PostList from '../components/postList';
import Pagination from '../components/pagination';
import Layout from '../components/layout';

type Props = {
  data: {
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
  path: string;
};

const PostListPage: React.FC<Props> = ({data, path}) => {
  const {
    allMarkdownRemark: {totalCount, edges: posts},
  } = data;

  return (
    <Layout>
      <PostList posts={posts} />
      <Pagination
        total={totalCount}
        current={parseInt(path.replace('/page', ''), 10)}
      />
    </Layout>
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
