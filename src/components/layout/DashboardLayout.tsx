import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #f7fafc;
  width: 100vw;
  position: relative;
  overflow-x: hidden; /* Prevent horizontal scroll */
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 0 32px;
  
  /* Force absolute centering on desktop */
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  
  /* Allow content direction to be inherited from document */
  direction: inherit;

  @media (max-width: 1200px) {
    padding: 0 24px;
  }

  @media (max-width: 768px) {
    /* Use normal flow on mobile for better performance */
    position: static;
    left: auto;
    transform: none;
    margin: 0 auto;
    padding: 0 16px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
  }
`;

const MainContent = styled.main`
  padding-bottom: 40px;
  
  /* Allow content to inherit document direction for text */
  direction: inherit;
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <ContentWrapper>
        <MainContent>
          {children}
        </MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
};