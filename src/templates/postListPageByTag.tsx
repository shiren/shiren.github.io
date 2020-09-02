import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';

import SEO from '../components/seo';
import Layout from '../components/layout';
import ListHeader from '../components/listHeader';
import PostList from '../components/postList';
import Pagination from '../components/pagination';

import { Category } from '../bases/category';

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
    category: string;
  };
};

const PostListPageByTag: React.FC<Props> = ({ data, pageContext }) => {
  const {
    allMarkdownRemark: { totalCount, edges: posts },
  } = data;

  return (
    <>
      <SEO article={false} />
      <Layout indicator={false}>
        <SEO />
        <ListHeader />
        <TagTitle>
          Tag: <Category to={`/${pageContext.category}/1`}>#{pageContext.category}</Category>
        </TagTitle>
        <PostList posts={posts} />
        <Pagination
          total={totalCount}
          current={pageContext.currentPage}
          path={`/${pageContext.category}/`}
        />
      </Layout>
    </>
  );
};

const TagTitle = styled.h3`
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
  font-size: 40px;

  & ${Category} {
    font-size: inherit;
  }
`;

export default PostListPageByTag;

export const postListByTagQuery = graphql`
  query postListByTagQuery($skip: Int!, $limit: Int!, $categoryRegex: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { categories: { regex: $categoryRegex }, layout: { eq: "post" } } }
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
