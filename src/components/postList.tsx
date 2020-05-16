import React from 'react';
import {Link} from 'gatsby';
import styled from 'styled-components';

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
          <ListItem to={node.fields.slug}>
            <h3>
              {node.frontmatter.title} <span>— {node.frontmatter.date}</span>
            </h3>
            <p>{node.excerpt}</p>
          </ListItem>
        </div>
      ))}
    </div>
  );
};

const ListItem = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default PostList;
