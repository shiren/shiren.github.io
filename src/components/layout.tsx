import React from "react"
import styled from "styled-components"

import "normalize.css"
import "../../assets/style.css"

import Top from "./top"
import Footer from "./footer"

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Top />
      <Container>
        <div>{children}</div>
      </Container>
      <Footer />
    </div>
  );
};

const Container = styled.div`
  margin: 0 auto;
  width: 750px;
`;

export default Layout;
