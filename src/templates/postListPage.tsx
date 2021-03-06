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
          frontmatter: { title: string; date: string; categories: string };
          fields: {
            slug: string;
          };
          excerpt: string;
        };
      }>;
    };
  };
  pageContext: {
    currentPage: number;
  };
};

const PostListPage: React.FC<Props> = ({ data, pageContext }) => {
  const {
    allMarkdownRemark: { totalCount, edges: posts },
  } = data;

  return (
    <>
      <SEO article={false} />
      <Layout indicator={false}>
        <SEO />
        <ListHeader />
        <PostList posts={posts} />
        <Pagination total={totalCount} current={pageContext.currentPage} path={'/page'} />
      </Layout>
    </>
  );
};

export default PostListPage;

export const postListQuery = graphql`
  query postListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      filter: { frontmatter: { layout: { eq: "post" } } }
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
            categories
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
