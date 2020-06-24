import React from "react"
import { graphql } from "gatsby"

import styled from "styled-components"

import Layout from "../components/layout"
import SEO from "../components/seo"

type Props = {
  data: {
    markdownRemark: {
      html: string;
      excerpt: string;
      frontmatter: {
        title: string;
        date: Date;
      };
    };
  };
};

const Post: React.FC<Props> = ({ data }) => {
  const post = data.markdownRemark;

  return (
    <>
      <SEO title={post.frontmatter.title} description={post.excerpt} article={true} />
      <Layout>
        <Headline>
          <h1>{post.frontmatter.title}</h1>
          <p>Posted on {post.frontmatter.date}</p>
        </Headline>
        <article dangerouslySetInnerHTML={{ __html: post.html }} />
      </Layout>
    </>
  );
};

const Headline = styled.header`
  margin: 130px 0 20px;

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

export default Post;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(truncate: true, pruneLength: 300)
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY")
      }
    }
  }
`;
