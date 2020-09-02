import React from 'react';
import { Link } from 'gatsby';
import { GlobeAsia } from '@styled-icons/fa-solid';
import styled from 'styled-components';

import { Categories, Category } from '../bases/category';

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
        <ListItem key={node.id}>
          <Linkable to={node.fields.slug.replace(/\s/g, '-')}>
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
          </Linkable>
          <Date>{node.frontmatter.date}</Date>
          <Categories>
            {node.frontmatter.categories.split(', ').map((category) => (
              <Category to={`/${category}/1`} key={category}>
                {category}
              </Category>
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

const Linkable = styled(Link)`
  text-decoration: none;
  color: #404040;

  &:hover > h3 {
    color: #00bcbb;
  }
`;

const ListItem = styled.div`
  display: block;
  margin: 35px 0 35px;
  text-decoration: none;
  color: #404040;
  clear: both;
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
