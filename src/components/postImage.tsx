import React from 'react';
import styled from 'styled-components';

type Props = {
  image: string;
  imageAuthor: string;
  imageAuthorLink: string;
  imageFrom: string;
  imageFromLink: string;
};

const PostImage: React.FC<Props> = ({
  image,
  imageAuthor,
  imageAuthorLink,
  imageFrom,
  imageFromLink,
}) => {
  return (
    <Wrapper>
      <img src={image} />
      <figcaption>
        Image by <a href={imageAuthorLink}>{imageAuthor}</a> from{' '}
        <a href={imageFromLink}>{imageFrom}</a>
      </figcaption>
    </Wrapper>
  );
};

const Wrapper = styled.figure`
  margin-top: -86px;

  @media only screen and (max-width: 1080px) {
    margin-top: 0;
  }

  & > img {
    width: 100%;
  }

  & > figcaption {
    font-size: 13px;
    text-align: center;
    color: #888;
  }
`;

export default PostImage;
