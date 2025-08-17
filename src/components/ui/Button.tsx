import React from 'react';
import styled, { css } from 'styled-components';
import type { ButtonProps } from '@/types';

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: #3182ce;
          color: white;
          &:hover:not(:disabled) {
            background-color: #2c5aa0;
          }
        `;
      case 'secondary':
        return css`
          background-color: #e2e8f0;
          color: #2d3748;
          &:hover:not(:disabled) {
            background-color: #cbd5e0;
          }
        `;
      case 'danger':
        return css`
          background-color: #e53e3e;
          color: white;
          &:hover:not(:disabled) {
            background-color: #c53030;
          }
        `;
      case 'success':
        return css`
          background-color: #38a169;
          color: white;
          &:hover:not(:disabled) {
            background-color: #2f855a;
          }
        `;
    }
  }}

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 6px 12px;
          font-size: 14px;
          min-height: 32px;
        `;
      case 'md':
        return css`
          padding: 8px 16px;
          font-size: 14px;
          min-height: 40px;
        `;
      case 'lg':
        return css`
          padding: 12px 24px;
          font-size: 16px;
          min-height: 48px;
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <StyledButton {...props} disabled={disabled || loading}>
      {loading && <LoadingSpinner data-testid="loading-spinner" />}
      {children}
    </StyledButton>
  );
};