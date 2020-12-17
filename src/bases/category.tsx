import { Link } from 'gatsby';
import styled from 'styled-components';

const Category = styled(Link)`
  display: inline-block;
  margin-right: 10px;
  border-bottom: 1px solid #777;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  text-transform: uppercase;
  text-decoration: none;
  color: #777;
`;

const Categories = styled.div`
  display: inline-block;
  margin-left: 10px;
`;

export { Categories, Category };
