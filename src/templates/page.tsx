import React from 'react';
import { graphql } from 'gatsby';

import styled from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';

type Props = {
  data: {
    markdownRemark: {
      html: string;
      excerpt: string;
      frontmatter: {
        title: string;
      };
      fields: {
        slug: string;
      };
    };
  };
};

const Page: React.FC<Props> = ({ data }) => {
  const post = data.markdownRemark;

  const foundedImageFromContentsOrNot = (post.html.match(/<img.*?src="(.*?)"/) || [])[1];

  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        article={false}
        image={foundedImageFromContentsOrNot}
      />
      <Layout>
        <Headline>
          <h1>{post.frontmatter.title}</h1>
        </Headline>
        <Article dangerouslySetInnerHTML={{ __html: post.html }} />
      </Layout>
    </>
  );
};

const Headline = styled.header`
  position: relative;
  margin: 130px 0 40px;

  & > h1 {
    font-size: 50px;
    text-align: center;
  }

  & > p {
    margin: 0 0 10px;
    font-size: 18px;
    font-style: italic;
    color: #808080;
  }
`;

const Article = styled.article`
  margin-top: 10px;

  @media only screen and (max-width: 1080px) {
    margin-top: 0;
  }
`;

export default Page;

export const query = graphql`
  query($slug: String!) {
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
  }
`;
