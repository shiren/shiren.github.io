import React from 'react';
import styled from 'styled-components';
import { Facebook, Github, InstagramSquare, Twitter } from '@styled-icons/fa-brands';
import { At, Rss } from '@styled-icons/fa-solid';
import { graphql, useStaticQuery } from 'gatsby';

const Footer: React.FC = () => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            ownerName
            sns {
              github
              instagram
              facebook
              twitter
            }
            email
            url
          }
        }
      }
    `
  );

  const { sns, email, url } = site.siteMetadata;

  const footerIcons: Record<string, JSX.Element> = {
    facebook: <Facebook />,
    instagram: <InstagramSquare />,
    twitter: <Twitter />,
    email: <At />,
    github: <Github />,
  };

  const urlMaker: Record<string, (id: string) => string> = {
    facebook: (id) => `//www.facebook.com/${id}`,
    instagram: (id) => `//www.instagram.com/${id}`,
    github: (id) => `//www.github.com/${id}`,
    twitter: (id) => `//www.twitter.com/${id}`,
    email: (id) => `mailto:${id}`,
  };

  return (
    <Wrapper>
      <FooterLinks>
        {[['email', email], ...Object.entries(sns)].map(([type, value], index) => (
          <li key={index}>
            <a href={urlMaker[type](value)} rel="noreferrer" target="_blank">
              {footerIcons[type]}
            </a>
          </li>
        ))}
        <li>
          <a href={`${url}/feed.xml`} rel="noreferrer" target="_blank">
            <Rss />
          </a>
        </li>
      </FooterLinks>
      <p>
        {site.siteMetadata.ownerName} • {new Date().getFullYear()}
      </p>
    </Wrapper>
  );
};

const Wrapper = styled.footer`
  margin-top: 50px;
  padding: 50px 0;
  background: #f5f5f5;
  border-top: 1px #eaeaea solid;
  text-align: center;

  & > div {
    margin: 0 auto;
    width: 750px;
    text-align: center;
    font-size: 14px;
  }
`;

const FooterLinks = styled.ul`
  margin: 0;
  padding: 0;
  text-align: center;

  & > li {
    display: inline-block;
    padding: 0 10px;
    width: 2em;
    height: 2em;
    list-style: none;
    vertical-align: middle;
  }

  & a {
    color: #404040;
  }
`;

export default Footer;
