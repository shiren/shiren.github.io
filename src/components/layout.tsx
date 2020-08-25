import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Top from './top';
import Footer from './footer';

const Layout: React.FC<{ indicator: boolean }> = ({ indicator, children }) => {
  const [notSupported, setNotSupported] = useState(false);

  useEffect(() => {
    const UA = window.navigator.userAgent;
    let version;

    const msie = UA.indexOf('MSIE ');
    if (msie > 0) {
      version = parseInt(UA.substring(msie + 5, UA.indexOf('.', msie)), 10);
    }

    const trident = UA.indexOf('Trident/');
    if (trident > 0) {
      const rv = UA.indexOf('rv:');

      version = parseInt(UA.substring(rv + 3, UA.indexOf('.', rv)), 10);
    }

    const edge = UA.indexOf('Edge/');
    if (edge > 0) {
      version = parseInt(UA.substring(edge + 5, UA.indexOf('.', edge)), 10);
    }

    setNotSupported(!!version && version < 11);
  }, []);

  return (
    <div>
      <Top useIndicator={indicator} />
      <Container>
        {notSupported ? (
          <h1>
            사용하시는 브라우저를 지원할 계획이 없습니다. This blog does not support your browser.
          </h1>
        ) : null}
        <div>{children}</div>
      </Container>
      <Footer />
    </div>
  );
};

const Container = styled.div`
  margin: 120px auto 0;
  width: 750px;
  padding: 0 15px;
  box-sizing: border-box;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

export default Layout;
