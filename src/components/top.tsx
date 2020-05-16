import React, {useEffect, useState} from 'react';
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
  return menus.map(({url, name}, index) => {
    return (
      <li key={index}>
        {url ? (
          <MenuButton onClick={() => goto(url)}>{name}</MenuButton>
        ) : (
          <MenuButton>{name}</MenuButton>
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

  const [shortTop, setShortTop] = useState(false);

  useEffect(() => {
    const handleScrollEvent = () => {
      const scrollTop = document.documentElement.scrollTop;

      if (scrollTop > 20) {
        setShortTop(true);
      } else {
        setShortTop(false);
      }
    }

    window.addEventListener('scroll', handleScrollEvent);

    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  return (
    <Wrapper shortTop={shortTop}>
      <LogoButton href={site.siteMetadata.url}>
        {site.siteMetadata.title}
      </LogoButton>
      <MenuList>{renderMenuItems(site.siteMetadata.menus)}</MenuList>
    </Wrapper>
  );
};

const MenuList = styled.ul`
  float: right;

  & > li {
  float: left;
  list-style: none;
  }
`;

const MenuButton = styled.button.attrs({type: 'button'})`
  background: none;
  border: none;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  color: #404040;
  cursor: pointer;
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

const Wrapper = styled.nav<{shortTop: boolean}>`
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  min-height: 50px;
  padding: ${props => (props.shortTop ? '0' : '20px 0')};
  margin-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
  background: #f5f6f6;
  transition: background 0.5s ease-in-out, padding 0.5s ease-in-out;
`;

export default Top;
