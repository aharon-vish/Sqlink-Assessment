import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

const Label = styled.label<{ required?: boolean }>`
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
  
  ${({ required }) => required && `
    &::after {
      content: ' *';
      color: #e53e3e;
    }
  `}
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid ${({ hasError }) => hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s ease-in-out;
  color: black;
  &:focus {
    outline: none;
    border-color: ${({ hasError }) => hasError ? '#e53e3e' : '#3182ce'};
  }
  
  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

const StyledSelect = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid ${({ hasError }) => hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${({ hasError }) => hasError ? '#e53e3e' : '#3182ce'};
  }
  
  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #e53e3e;
`;

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  required, 
  id,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div>
      {label && <Label required={required} htmlFor={inputId}>{label}</Label>}
      <StyledInput {...props} id={inputId} hasError={!!error} />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  required, 
  children,
  id, 
  ...props 
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div>
      {label && <Label required={required} htmlFor={selectId}>{label}</Label>}
      <StyledSelect {...props} id={selectId} hasError={!!error}>
        {children}
      </StyledSelect>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};