import React from 'react';
import styled from 'styled-components';

import {useStaticQuery, graphql, navigate} from 'gatsby';

type Menu = {
  name: string;
  url?: string;
  children?: Menu[];
};

const goto = (url: string) => {
  if (url.includes('http')) {
    location.replace(url);
  } else {
    navigate(url);
  }
};

const renderMenuItems = (menus: Menu[]) => {
  return menus.map((item, index) => {
    return (
      <li key={index}>
        {item.url ? (
          <MenuButton onClick={() => goto(item.url!)}>{item.name}</MenuButton>
        ) : (
          <MenuButton>{item.name}</MenuButton>
        )}
      </li>
    );
  });
};

const Top: React.FC = () => {
  const {site} = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            url
            menus {
              name
              url
            }
          }
        }
      }
    `
  );

  return (
    <Wrapper>
      <LogoButton href={site.siteMetadata.url}>
        {site.siteMetadata.title}
      </LogoButton>
      <MenuList>{renderMenuItems(site.siteMetadata.menus)}</MenuList>
    </Wrapper>
  );
};

const MenuList = styled.ul`
  float: right;
`;

const MenuButton = styled.button.attrs({type: 'button'})`
  background: none;
  border: none;
`;

const LogoButton = styled.a`
  float: left;
  padding: 15px 15px;
  font-size: 18px;
  line-height: 20px;
  font-weight: 800;
  color: #404040;
  text-decoration: none;
`;

const Wrapper = styled.nav`
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  min-height: 50px;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
  background: #f5f6f6;
`;

export default Top;
