import React from 'react';

import {graphql} from 'gatsby';

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
    };
  };
};

const Post: React.FC<Props> = ({data}) => {
  const post = data.markdownRemark;

  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        article={true}
      />
      <Layout>
        <h1>{post.frontmatter.title}</h1>
        <article dangerouslySetInnerHTML={{__html: post.html}} />
      </Layout>
    </>
  );
};

export default Post;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      excerpt(truncate: true, pruneLength: 300)
      frontmatter {
        title
      }
    }
  }
`;
