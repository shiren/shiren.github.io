import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

type Props = {
  total: number;
  current: number;
  path: string;
};

const COUNT_PER_PAGE = 6;

const Pagination: React.FC<Props> = ({ total, current, path }) => {
  const getPrevUrl = () => `${path}${current - 1}`;
  const getNextUrl = () => `${path}${current === 0 ? 2 : current + 1}`;

  const hasNext = current < total / COUNT_PER_PAGE;
  const hasPrev = current > 1;

  return (
    <Wrapper>
      {hasPrev && (
        <PaginationLink align="left" to={getPrevUrl()}>
          ← Newer Posts
        </PaginationLink>
      )}
      {hasNext && (
        <PaginationLink align="right" to={getNextUrl()}>
          Older Posts →
        </PaginationLink>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`;

const PaginationLink = styled(Link)<{ align: string }>`
  float: ${({ align }) => align};
  padding: 15px 25px;
  border: 1px solid #ddd;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #404040;

  &:hover {
    color: #fff;
    background: #0085a1;
    border: 1px solid #0085a1;
  }
`;

export default Pagination;
