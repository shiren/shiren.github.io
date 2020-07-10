import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

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
                <RecomendLink to={slug.replace(/\s/g, '-')}>
                  {categories.map((category) => (
                    <Category key={category}>{category}</Category>
                  ))}
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
  margin-top: 100px;
  padding-top: 10px;
  border-top: 1px solid #000;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
`;

const Title = styled.h4`
  padding: 0;
  margin: 10px 0 0 0;
  font-size: 15px;
  color: #000;
  transition: color 0.3s ease-in-out;
`;

const Item = styled.div`
  margin-bottom: 30px;
  padding: 0 15px;
  flex: 0 0 50%;
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

const RecomendLink = styled(Link)`
  display: block;
  text-decoration: none;
`;

export default RecomendPost;
