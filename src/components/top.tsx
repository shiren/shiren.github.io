import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { AlignJustify } from '@styled-icons/fa-solid';

import { graphql, Link, useStaticQuery } from 'gatsby';

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

const Top: React.FC<{ useIndicator: boolean }> = ({ useIndicator }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            url
            image
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
  const [openMenu, setOpenMenu] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScrollEvent = () => {
      const scrollTop = document.documentElement.scrollTop;

      if (scrollTop > 20) {
        setShortTop(true);
      } else {
        setShortTop(false);
      }

      const progress = Math.min(
        (scrollTop /
          (document.documentElement.scrollHeight - document.documentElement.clientHeight)) *
          100,
        100
      );

      useIndicator && setProgress(progress);
    };

    window.addEventListener('scroll', handleScrollEvent);

    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, [useIndicator]);

  return (
    <Wrapper shortTop={shortTop} showMenu={openMenu}>
      <LogoButton href={site.siteMetadata.url}>
        <img alt="logo" src={site.siteMetadata.image} />
        {site.siteMetadata.title}
      </LogoButton>
      <MenuButton onClick={() => setOpenMenu(!openMenu)}>
        <AlignJustify />
      </MenuButton>
      <MenuList>{renderMenuItems(site.siteMetadata.menus)}</MenuList>
      {useIndicator && <Indicator progress={progress} />}
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

const MenuButton = styled.button`
  float: right;
  width: 25px;
  padding: 0;
  margin-top: 15px;
  margin-right: 20px;
  background: none;
  border: none;
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
    color: #000;
    text-decoration: none;
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    cursor: pointer;
  }

  & > li > a,
  & > li > button {
    font-weight: 500;
  }

  & > li > a:hover,
  & > li > button:hover {
    text-decoration: underline;
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
  color: #000;
  text-decoration: none;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  & > img {
    width: 30px;
    vertical-align: middle;
    border-radius: 50%;
    margin: 0 10px;
  }
`;

const Indicator = styled.span.attrs<{ progress: number }>(({ progress }) => ({
  style: { width: `${progress}%` },
}))<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  background: #88c0d0;
`;

const Wrapper = styled.nav<{ shortTop: boolean; showMenu: boolean }>`
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  min-height: 50px;
  padding: ${({ shortTop }) => (shortTop ? '0' : '20px 0')};
  margin-bottom: 20px;
  border-bottom: 1px solid #000;
  background: #fff;
  transition: background 0.5s ease-in-out, padding 0.5s ease-in-out;
  z-index: 1000;

  & > ${MenuButton} {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    & > ${MenuButton} {
      display: inline-block;
    }

    & > ${MenuList} {
      display: ${({ showMenu }) => (showMenu ? 'block' : 'none')};
      float: none;
      margin-top: 60px;
    }

    & > ${MenuList} > li {
      float: none;

      & > a,
      & > button {
        text-decoration: none;
      }
    }

    & ${SubMenus} {
      display: block;
      position: relative;
      background: none;
    }

    & ${DropButton} {
      &:hover {
        background: none;
        text-decoration: none;
      }

      outline: 0;
      cursor: default;
    }

    & ${DropMenu} {
      background: none;
      &:hover ${DropButton} {
        background: none;
      }
    }

    & ${SubMenu} {
      &:before {
        content: '-';
        vertical-align: middle;
      }

      & a,
      & button {
        display: inline-block;
        vertical-align: middle;
        text-decoration: none;
      }
      box-sizing: border-box;
      padding-left: 30px;
      text-align: left;
      background: none;
      border: none;
    }
  }
`;

export default Top;
