import React from 'react';
import { Link } from 'gatsby';
import { GlobeAsia } from '@styled-icons/fa-solid';
import styled from 'styled-components';

type Props = {
  posts: Array<{
    node: {
      id: string;
      frontmatter: { title: string; date: string; categories: string[] };
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
        <ListItem to={node.fields.slug.replace(/\s/g, '-')} key={node.id}>
          <PostHeader>
            {node.frontmatter.categories.includes('translation') ? (
              <Icon>
                <GlobeAsia />
                번역
              </Icon>
            ) : null}
            {node.frontmatter.title}
          </PostHeader>
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

const Icon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  padding: 3px;
  vertical-align: top;
  font-size: 10px;

  & svg {
    vertical-align: top;
  }
`;

export default PostList;
