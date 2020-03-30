import React from 'react';
import {graphql} from 'gatsby';

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
    <div>
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.html}} />
    </div>
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
