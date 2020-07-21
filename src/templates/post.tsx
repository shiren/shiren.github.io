import React from 'react';
import { graphql } from 'gatsby';

import styled from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Share from '../components/share';
import RecomendPost from '../components/recomendPost';

type Props = {
  data: {
    markdownRemark: {
      html: string;
      excerpt: string;
      frontmatter: {
        title: string;
        date: string;
        categories: string;
      };
      fields: {
        slug: string;
      };
    };
    recomendPost: {
      nodes: Array<{
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          categories: string;
          date: string;
        };
        excerpt: string;
      }>;
    };
    recentPost: {
      nodes: Array<{
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          categories: string;
          date: string;
        };
        excerpt: string;
      }>;
    };
  };
};

const Post: React.FC<Props> = ({ data }) => {
  const post = data.markdownRemark;

  const recomendPost = [...data.recomendPost.nodes, ...data.recentPost.nodes]
    .map((node) => ({
      title: node.frontmatter.title,
      slug: node.fields.slug,
      excerpt: node.excerpt,
      date: node.frontmatter.date,
      categories: node.frontmatter.categories.split(', '),
    }))
    .filter((node) => node.slug !== post.fields.slug)
    .sort(() => Math.random() * 2 - 1);

  recomendPost.splice(4, 4);

  return (
    <>
      <SEO title={post.frontmatter.title} description={post.excerpt} article={true} />
      <Layout>
        <Headline>
          <h1>{post.frontmatter.title}</h1>
          <p>Posted on {post.frontmatter.date} </p>
        </Headline>
        <Share
          title={post.frontmatter.title}
          path={post.fields.slug}
          tags={post.frontmatter.categories.split(', ')}
        />
        <Article dangerouslySetInnerHTML={{ __html: post.html }} />
        {recomendPost.length ? <RecomendPost posts={recomendPost} /> : null}
      </Layout>
    </>
  );
};

const Headline = styled.header`
  position: relative;
  margin: 130px 0 40px;

  & > h1 {
    font-size: 50px;
  }

  & > p {
    margin: 0 0 10px;
    font-size: 18px;
    font-style: italic;
    color: #808080;
  }
`;

const Article = styled.article`
  margin-top: -86px;

  @media only screen and (max-width: 1080px) {
    margin-top: 0;
  }
`;

export default Post;

export const query = graphql`
  query($slug: String!, $categoriesRegex: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      excerpt(truncate: true, pruneLength: 300)
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY")
        categories
      }
    }
    recomendPost: allMarkdownRemark(
      filter: {
        frontmatter: { categories: { regex: $categoriesRegex } }
        fields: { slug: { ne: $slug } }
      }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 4
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          categories
          date(formatString: "DD MMMM, YYYY")
        }
        excerpt(truncate: true, pruneLength: 300)
      }
    }
    recentPost: allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }, limit: 4) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          categories
          date(formatString: "DD MMMM, YYYY")
        }
        excerpt(truncate: true, pruneLength: 300)
      }
    }
  }
`;
