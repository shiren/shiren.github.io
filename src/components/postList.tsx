import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

type Props = {
  posts: Array<{
    node: {
      id: string;
      frontmatter: { title: string; date: string };
      fields: {
        slug: string;
      };
      excerpt: string;
    };
  }>;
};

const PostList: React.FC<Props> = ({ posts }) => {
  return (
    <div>
      {posts.map(({ node }) => (
        <ListItem to={node.fields.slug} key={node.id}>
          <PostHeader>{node.frontmatter.title}</PostHeader>
          <PostDate>Posted on {node.frontmatter.date}</PostDate>
          <PostEntry>
            {node.excerpt} <ReadMore>[Read More]</ReadMore>
          </PostEntry>
        </ListItem>
      ))}
    </div>
  );
};

const ListItem = styled(Link)`
  display: block;
  margin: 35px 0;
  text-decoration: none;
  color: #404040;

  &:hover > h3 {
    color: #0085a1;
  }
`;

const PostHeader = styled.h3`
  padding: 0;
  font-size: 36px;
`;

const PostDate = styled.p`
  margin: 0 0 10px 0;
  color: #808080;
  font-size: 18px;
  font-style: italic;
`;

const PostEntry = styled.p`
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const ReadMore = styled.span`
  font-weight: 800;
`;

export default PostList;
