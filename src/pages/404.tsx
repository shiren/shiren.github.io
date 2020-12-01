import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';

import styled from 'styled-components';

import Layout from '../components/layout';

import { trackCustomEvent } from 'gatsby-plugin-google-analytics';

const Page404: React.FC = () => {
  const [redirectURL, setRedirectURL] = useState<null | string>(null);

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  const renderRedirectIfNeed = () => {
    return redirectURL ? (
      <p>
        번역 포스트는 주소가 변경되었습니다.
        <br />
        <a href={redirectURL}>{redirectURL}</a>
      </p>
    ) : null;
  };

  useEffect(() => {
    const decodedURL = decodeURIComponent(location.href);

    if (decodedURL.includes('(번역)')) {
      setRedirectURL(decodedURL.replace('(번역)', ''));
    }

    trackCustomEvent({
      category: 'Error',
      action: '404',
      label: decodedURL,
    });

    typeof window !== 'undefined' &&
      (window as any).gtag('event', 'Error', {
        event_category: '404', // eslint-disable-line camelcase
        event_label: decodedURL, // eslint-disable-line camelcase
      });
  }, []);

  return (
    <>
      <Layout indicator={false}>
        <Wrapper>
          <h1>Page not found</h1>
          <p>두둠칫🎶 두둠칫🎶 두둠두둠둠🎶 두둠칫칫🎶</p>
          <img src="/image/lime404.gif" alt="lime" />
          {renderRedirectIfNeed()}
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

  & > a {
    display: block;
    margin-top: 30px;
    cursor: pointer;
    text-decoration: underline;
  }

  & > p > a {
    font-size: 14px;
  }
`;

export default Page404;
