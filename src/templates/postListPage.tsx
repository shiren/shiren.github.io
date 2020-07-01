import React from 'react';
import { graphql } from 'gatsby';

import SEO from '../components/seo';
import Layout from '../components/layout';
import ListHeader from '../components/listHeader';
import PostList from '../components/postList';
import Pagination from '../components/pagination';

type Props = {
  data: {
    allMarkdownRemark: {
      totalCount: number;
      edges: Array<{
        node: {
          id: string;
          frontmatter: { title: string; date: string };
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

const PostListPage: React.FC<Props> = ({ data, path }) => {
  const {
    allMarkdownRemark: { totalCount, edges: posts },
  } = data;

  const currentPage = parseInt(path.replace('/page', ''), 10) || 0;

  return (
    <Layout>
      <SEO/>
      <ListHeader/>
      <PostList posts={posts} />
      <Pagination total={totalCount} current={currentPage} />
    </Layout>
  );
};

export default PostListPage;

export const postListQuery = graphql`
  query postListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
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
          excerpt(truncate: true, pruneLength: 300)
        }
      }
    }
  }
`;
