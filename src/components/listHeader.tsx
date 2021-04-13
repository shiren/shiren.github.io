import React from 'react';
import styled from 'styled-components';

import { graphql, useStaticQuery } from 'gatsby';

const ListHeader: React.FC = () => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            ownerNickname
            image
            description
          }
        }
      }
    `
  );

  return (
    <Container>
      <Logo src={site.siteMetadata.image} />
      <Title>{site.siteMetadata.ownerNickname}</Title>
      <Desc>{site.siteMetadata.description}</Desc>
    </Container>
  );
};

const Container = styled.header`
  margin-bottom: 50px;
  text-align: center;
  clear: both;
`;

const Title = styled.h2`
  margin: 0 auto;
  line-height: 1;
  font-size: 40px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  letter-spacing: 2.5px;
  color: #444;
`;

const Logo = styled.img`
  width: 130px;
  border-radius: 50%;
`;

const Desc = styled.p`
  margin-top: -2px;
  text-transform: lowercase;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #636f88;
  font-size: 12px;
  letter-spacing: -0.1px;
`;

export default styled(ListHeader)`
  margin: 0 auto;
  width: 750px;
`;
