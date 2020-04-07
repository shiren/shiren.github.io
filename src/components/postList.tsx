import React from 'react';
import {Link} from 'gatsby';
import {css} from '@emotion/core';

type Props = {
  posts: Array<{
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

const PostList: React.FC<Props> = ({posts}) => {
  return (
    <div>
      {posts.map(({node}) => (
        <div key={node.id}>
          <Link
            to={node.fields.slug}
            css={css`
              text-decoration: none;
              color: inherit;
            `}
          >
            <h3
              css={css`
                margin-bottom: 10;
              `}
            >
              {node.frontmatter.title}{' '}
              <span
                css={css`
                  color: #bbb;
                `}
              >
                — {node.frontmatter.date}
              </span>
            </h3>
            <p>{node.excerpt}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostList;
