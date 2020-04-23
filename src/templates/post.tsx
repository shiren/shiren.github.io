import React from 'react';
import {Helmet} from 'react-helmet';

import {graphql} from 'gatsby';

import Layout from '../components/layout';

type Props = {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
    markdownRemark: {
      html: string;
      frontmatter: {
        title: string;
      };
    };
  };
};

const Post: React.FC<Props> = ({data}) => {
  const post = data.markdownRemark;

  return (
    <>
      <Helmet>
        <title>{post.frontmatter.title}</title>
      </Helmet>
      <Layout>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{__html: post.html}} />
      </Layout>
    </>
  );
};

export default Post;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
      }
    }
  }
`;
