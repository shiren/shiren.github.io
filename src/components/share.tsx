import React from 'react';
import { FacebookF, LinkedinIn, RedditAlien, Twitter } from '@styled-icons/fa-brands';
import { ShareAlt } from '@styled-icons/fa-solid';
import { FacebookShareButton, LinkedinShareButton, RedditShareButton, TwitterShareButton } from 'react-share';

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
    `,
  );

  const fullUrl = `${url}${path}`;

  return (
    <Wrapper>
      <TitleIcon>
        <ShareAlt/>
      </TitleIcon>
      <FacebookShareButton url={fullUrl} className="button is-outlined is-rounded facebook">
        <Icon>
          <FacebookF/>
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
          <Twitter/>
        </Icon>
      </TwitterShareButton>
      <LinkedinShareButton
        url={fullUrl}
        className="button is-outlined is-rounded linkedin"
        title={title}
      >
        <Icon className="icon">
          <LinkedinIn/>
        </Icon>
      </LinkedinShareButton>
      <RedditShareButton
        url={fullUrl}
        className="button is-outlined is-rounded reddit"
        title={title}
      >
        <Icon className="icon">
          <RedditAlien/>
        </Icon>
      </RedditShareButton>
    </Wrapper>
  );
};

const Wrapper = styled.span`
  float: right;
  vertical-align: middle;
  & > button {
    margin: 0 0.25rem;
  }
`;

const Icon = styled.span`
  vertical-align: middle;
  & > svg {
    height: 20px;
    width: 20px;
  }
`;

const TitleIcon = styled(Icon)`
  color: #81a1c1;
`;

export default styled(Share)``;
