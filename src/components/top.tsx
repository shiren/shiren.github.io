import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useStaticQuery, graphql, Link } from 'gatsby';

type Menu = {
  name: string;
  url?: string;
  children?: Menu[];
};

const renderLinkButton = (url: string, name: string) =>
  url.includes('http') ? (
    <a href={url} target="__blank">
      {name}
    </a>
  ) : (
    <Link to={url}>{name}</Link>
  );

const renderMenuItems = (menus: Menu[]) => {
  return menus.map(({ url, name, children }, index) =>
    url ? (
      <li key={index}>{renderLinkButton(url, name)}</li>
    ) : (
      <DropMenu key={index}>
        <DropButton>{name}</DropButton>
        <SubMenus>
          {children?.map((child, subIndex) => (
            <SubMenu key={subIndex}>{renderLinkButton(child.url!, child.name)}</SubMenu>
          ))}
        </SubMenus>
      </DropMenu>
    )
  );
};

const Top: React.FC = () => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            url
            menus {
              name
              url
              children {
                name
                url
              }
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
    };

    window.addEventListener('scroll', handleScrollEvent);

    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  return (
    <Wrapper shortTop={shortTop}>
      <LogoButton href={site.siteMetadata.url}>{site.siteMetadata.title}</LogoButton>
      <MenuList>{renderMenuItems(site.siteMetadata.menus)}</MenuList>
    </Wrapper>
  );
};

const SubMenu = styled.li`
  border: 1px solid #eaeaea;
  border-width: 0 1px 1px;
  background: #f5f5f5;
  text-align: center;

  &:hover {
    background: #eee;
  }
`;

const MenuList = styled.ul`
  float: right;
  padding: 0;
  margin: 0;

  & ul {
    padding: 0;
  }

  & > li {
    float: left;
  }
  & li {
    list-style: none;
  }
  & a,
  & button {
    display: block;
    padding: 15px 15px;
    line-height: 20px;
    background: none;
    border: none;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
    color: #404040;
    text-decoration: none;
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    cursor: pointer;
  }

  & > li > a,
  & > li > button {
    font-weight: 800;
  }
`;

const SubMenus = styled.ul`
  display: none;
  position: absolute;
`;

const DropButton = styled.button`
  &:hover {
    background: #eee;
  }

  &:after {
    content: ' \u25BC';
  }

  & ~ ul {
    display: none;
  }
`;

const DropMenu = styled.li`
  &:hover ${DropButton} {
    background: #eee;
  }

  &:hover ${SubMenus} {
    display: block;
  }
`;

const LogoButton = styled.a`
  float: left;
  padding: 15px 15px;
  font-size: 18px;
  line-height: 20px;
  font-weight: 800;
  color: #404040;
  text-decoration: none;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const Wrapper = styled.nav<{ shortTop: boolean }>`
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  min-height: 50px;
  padding: ${(props) => (props.shortTop ? '0' : '20px 0')};
  margin-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
  background: #f5f6f6;
  transition: background 0.5s ease-in-out, padding 0.5s ease-in-out;
`;

export default Top;
