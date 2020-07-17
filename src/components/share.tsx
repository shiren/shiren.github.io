import React, { useLayoutEffect, useState } from 'react';
import { FacebookF, LinkedinIn, RedditAlien, Twitter } from '@styled-icons/fa-brands';
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';

import { graphql, useStaticQuery } from 'gatsby';
import styled from 'styled-components';

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

  const [headlineVisible, setHeadlineVisible] = useState(true);
  const wrapperRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const shareTop = React.useRef<number>();

  const fullUrl = `${url}${path}`;

  const positionShare = () => {
    const scrollTopWithNumberWhatIDontKnow = document.documentElement.scrollTop + 70;

    if (scrollTopWithNumberWhatIDontKnow >= shareTop.current!) {
      console.log('1');
      setHeadlineVisible(false);
    } else {
      console.log('2');
      setHeadlineVisible(true);
    }
  };

  useLayoutEffect(() => {
    console.log('layoutEffect', wrapperRef.current.getBoundingClientRect());

    shareTop.current = wrapperRef.current.getBoundingClientRect().y;

    console.log(shareTop.current);

    window.addEventListener('scroll', positionShare);

    return () => window.removeEventListener('scroll', positionShare);
  }, []);

  return (
    <Wrapper headlineVisible={headlineVisible} ref={wrapperRef}>
      <Title>Share</Title>
      <FacebookShareButton url={fullUrl} className="button is-outlined is-rounded facebook">
        <Icon>
          <FacebookF />
        </Icon>
      </FacebookShareButton>
      <TwitterShareButton
        url={fullUrl}
        className="button is-outlined is-rounded twitter"
        title={title}
        via={sns.twitter.split('@').join('')}
        hashtags={tags}
      >
        <Icon className="icon">
          <Twitter />
        </Icon>
      </TwitterShareButton>
      <LinkedinShareButton
        url={fullUrl}
        className="button is-outlined is-rounded linkedin"
        title={title}
      >
        <Icon className="icon">
          <LinkedinIn />
        </Icon>
      </LinkedinShareButton>
      <RedditShareButton
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

const Wrapper = styled.div<{ headlineVisible: boolean }>`
  height: 1px;
  width: 150px;
  position: ${({ headlineVisible }) => (headlineVisible ? 'relative' : 'fixed')};
  top: ${({ headlineVisible }) => (headlineVisible ? '40px' : '42px')};
  left: ${({ headlineVisible }) => (headlineVisible ? '-180px' : '51px')};
  vertical-align: middle;

  & > button {
    margin: 0 0.25rem;
  }

  & > button:first-child {
    margin: 0 0.25rem 0 0 !important;
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
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: 800;
`;

export default styled(Share)``;
