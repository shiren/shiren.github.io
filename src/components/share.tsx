import React from 'react';
import { FacebookF, LinkedinIn, RedditAlien, Twitter } from '@styled-icons/fa-brands';
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';

import { graphql, useStaticQuery } from 'gatsby';
import styled from 'styled-components';

import { trackCustomEvent } from 'gatsby-plugin-google-analytics';

type Props = {
  title: string;
  path: string;
  tags: Array<string>;
};

const Share: React.FC<Props> = ({ path, title, tags }) => {
  const {
    site: {
      siteMetadata: { sns, url },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            sns {
              facebook
              twitter
            }
            url
          }
        }
      }
    `
  );

  const sendShareGa = (type: string) => {
    trackCustomEvent({
      category: 'Share',
      action: type,
      label: decodeURIComponent(location.href),
    });

    typeof window !== 'undefined' &&
      (window as any).gtag('event', 'click', {
        event_category: 'Share', // eslint-disable-line camelcase
        event_label: decodeURIComponent(location.href), // eslint-disable-line camelcase
      });
  };

  const wrapperRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const fullUrl = `${url}${path}`;

  return (
    <Wrapper ref={wrapperRef}>
      <Title>Share</Title>
      <FacebookShareButton
        onClick={() => sendShareGa('facebook')}
        url={fullUrl}
        className="button is-outlined is-rounded facebook"
      >
        <Icon>
          <FacebookF />
        </Icon>
      </FacebookShareButton>
      <TwitterShareButton
        onClick={() => sendShareGa('twitter')}
        url={fullUrl}
        className="button is-outlined is-rounded twitter"
        title={title}
        via={sns.twitter.replace('@', '')}
        hashtags={tags}
      >
        <Icon className="icon">
          <Twitter />
        </Icon>
      </TwitterShareButton>
      <LinkedinShareButton
        onClick={() => sendShareGa('linkedin')}
        url={fullUrl}
        className="button is-outlined is-rounded linkedin"
        title={title}
      >
        <Icon className="icon">
          <LinkedinIn />
        </Icon>
      </LinkedinShareButton>
      <RedditShareButton
        onClick={() => sendShareGa('reddit')}
        url={fullUrl}
        className="button is-outlined is-rounded reddit"
        title={title}
      >
        <Icon className="icon">
          <RedditAlien />
        </Icon>
      </RedditShareButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 150px;
  position: sticky;
  top: 100px;
  margin-left: -180px;
  vertical-align: middle;

  & > button {
    margin: 0 0.25rem;
  }

  & > button:first-child {
    margin: 0 0.25rem 0 0 !important;
  }

  @media only screen and (max-width: 1080px) {
    position: relative;
    float: right;
    width: 200px;
    top: 0;
    margin: -69px 0 0 0;
  }

  @media only screen and (max-width: 460px) {
    position: relative;
    float: none;
    margin: -40px 0 0 0;
  }
`;

const Icon = styled.span`
  vertical-align: middle;
  & > svg {
    height: 20px;
    width: 20px;
  }
`;

const Title = styled.h3`
  border-bottom: 1px solid #000;
  color: #000;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: 800;

  @media only screen and (max-width: 1080px) {
    display: inline-block;
    border-bottom: none;
    vertical-align: middle;
    margin: 0;
  }
`;

export default styled(Share)``;
