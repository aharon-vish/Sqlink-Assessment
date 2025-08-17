import React from 'react';
import styled from 'styled-components';
import { useTranslation } from '@/hooks/useTranslation';
import type { Language } from '@/i18n/config';

const SelectorContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const LanguageButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isRTL'
})<{ isRTL: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  
  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
  
  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }
`;

const Flag = styled.span`
  font-size: 18px;
  line-height: 1;
`;
const NativeName = styled.span`
  color:black;
`;

const LanguageText = styled.span`
  font-weight: 500;
  color: #2d3748;
`;

const ChevronIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isRTL'
})<{ isRTL: boolean }>`
  transform: ${({ isRTL }) => isRTL ? 'rotate(90deg)' : 'rotate(-90deg)'};
  transition: transform 0.2s ease-in-out;
  font-size: 12px;
  color: #718096;
`;

const Dropdown = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen' && prop !== 'isRTL'
})<{ isOpen: boolean; isRTL: boolean }>`
  position: absolute;
  top: 100%;
  ${({ isRTL }) => isRTL ? 'left: 0;' : 'right: 0;'}
  margin-top: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-4px)'};
  transition: all 0.2s ease-in-out;
`;

const LanguageOption = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isRTL'
})<{ isActive: boolean; isRTL: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: ${({ isActive }) => isActive ? '#f7fafc' : 'transparent'};
  border: none;
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f7fafc;
  }
  
  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  
  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const languages: Array<{ code: Language; flag: string; name: string; nativeName: string }> = [
  { code: 'en', flag: '🇺🇸', name: 'English', nativeName: 'English' },
  { code: 'he', flag: '🇮🇱', name: 'Hebrew', nativeName: 'עברית' },
];

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, isRTL } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  
  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('[data-language-selector]')) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <SelectorContainer data-language-selector data-testid="language-selector">
      <LanguageButton
        isRTL={isRTL}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Flag>{currentLang.flag}</Flag>
        <LanguageText>{currentLang.nativeName}</LanguageText>
        <ChevronIcon isRTL={isRTL}>▼</ChevronIcon>
      </LanguageButton>
      
      <Dropdown isOpen={isOpen} isRTL={isRTL}>
        {languages.map((language) => (
          <LanguageOption
            key={language.code}
            isActive={language.code === currentLanguage}
            isRTL={isRTL}
            onClick={() => handleLanguageChange(language.code)}
            data-testid={`language-option-${language.code}`}
          >
            <Flag>{language.flag}</Flag>
            <NativeName>{language.nativeName}</NativeName>
          </LanguageOption>
        ))}
      </Dropdown>
    </SelectorContainer>
  );
};