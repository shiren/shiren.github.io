import React from 'react';
import { Link } from 'gatsby';
import { GlobeAsia } from '@styled-icons/fa-solid';
import styled from 'styled-components';

type Props = {
  posts: Array<{
    node: {
      id: string;
      frontmatter: { title: string; date: string; categories: string };
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
          <PostEntry>{node.excerpt}</PostEntry>
          <Date>{node.frontmatter.date}</Date>
          <Categories>
            {node.frontmatter.categories.split(', ').map((category) => (
              <Category key={category}>{category}</Category>
            ))}
          </Categories>
        </ListItem>
      ))}
    </div>
  );
};

const Date = styled.p`
  display: inline-block;
  margin: 0;
  padding: 0;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.5;
  color: #b1b1b1;
`;

const Category = styled.span`
  display: inline-block;
  margin-right: 10px;
  border-bottom: 1px solid #777;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  text-transform: uppercase;
  color: #777;
`;

const Categories = styled.div`
  display: inline-block;
  margin-left: 10px;
`;

const ListItem = styled(Link)`
  display: block;
  margin: 35px 0 35px;
  text-decoration: none;
  color: #404040;
  clear: both;

  &:hover > h3 {
    color: #0085a1;
  }
`;

const PostHeader = styled.h3`
  padding: 0;
  font-size: 36px;
`;

const PostEntry = styled.p`
  margin: 10px 0 5px;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
