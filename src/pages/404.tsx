import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

import styled from 'styled-components';

import Layout from '../components/layout';

import { trackCustomEvent } from 'gatsby-plugin-google-analytics';

const Page404: React.FC = () => {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    trackCustomEvent({
      category: 'Error',
      action: '404',
    });
  }, []);

  return (
    <>
      <Layout>
        <Wrapper>
          <h1>Page not found</h1>
          <p>두둠칫🎶 두둠칫🎶 두둠두둠둠🎶 두둠칫칫🎶</p>
          <img src="/image/lime404.gif" alt="lime" />
          <a onClick={goBack}>이전으로</a>
        </Wrapper>
      </Layout>
    </>
  );
};

const Wrapper = styled.div`
  text-align: center;
  padding-bottom: 300px;

  & h1 {
    margin-bottom: 30px;
  }

  & a {
    display: block;
    margin-top: 30px;
    cursor: pointer;
    text-decoration: underline;
  }
`;

export default Page404;
