import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

import { Category } from '../bases/category';

type Props = {
  posts: Array<{
    title: string;
    slug: string;
    excerpt: string;
    date: string;
    categories: Array<string>;
  }>;
};

const RecomendPost: React.FC<Props> = ({ posts }) => {
  return (
    <Wrapper>
      <h3>Recommend Post...</h3>
      <Container>
        {posts.map(({ title, slug, categories, date }) => {
          return (
            <Item key={slug}>
              <div>
                <div>
                  {categories.map((category) => (
                    <Category to={`/${category}/1`} key={category}>
                      {category}
                    </Category>
                  ))}
                </div>
                <RecomendLink to={slug.replace(/\s/g, '-')}>
                  <Title>{title}</Title>
                  <Date>{date}</Date>
                </RecomendLink>
              </div>
            </Item>
          );
        })}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 40px;
  padding-top: 10px;
  border-top: 1px solid #000;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px 10px 0;
  justify-content: space-between;
`;

const Title = styled.h4`
  padding: 0;
  margin: 10px 0 0 0;
  font-size: 15px;
  color: #000;
  transition: color 0.3s ease-in-out;
`;

const Item = styled.div`
  flex: 0 0 49%;
  margin: 0 0 25px;
  flex-direction: column;
  box-sizing: border-box;

  & > div {
    padding: 8px;
    border: 1px solid #000;
    border-top: 10px solid #000;
    transition: background 0.3s ease-in-out;
  }

  &:hover > div {
    background: #000;
  }

  &:hover ${Title} {
    color: #fff;
  }
`;

const Date = styled.p`
  margin: 10px 0 0 0;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.5;
  color: #b1b1b1;
`;

const RecomendLink = styled(Link)`
  display: block;
  text-decoration: none;
`;

export default RecomendPost;
