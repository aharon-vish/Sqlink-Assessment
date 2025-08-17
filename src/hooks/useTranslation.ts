import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { Language } from '@/i18n/config';

export const useTranslation = (namespace?: string) => {
  const { t, i18n } = useI18nTranslation(namespace);
  
  const currentLanguage = i18n.language as Language;
  const isRTL = currentLanguage === 'he';
  
  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
    
    // Update document direction and lang attribute
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  const formatDate = (timestamp: number): string => {
    if (!timestamp) return '-';
    
    const date = new Date(timestamp);
    
    return date.toLocaleString(currentLanguage === 'he' ? 'he-IL' : 'en-US', {
      month: 'short',
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: currentLanguage === 'en',
    });
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString(currentLanguage === 'he' ? 'he-IL' : 'en-US');
  };

  return {
    t,
    i18n,
    currentLanguage,
    isRTL,
    changeLanguage,
    formatDate,
    formatNumber,
  };
};

// Helper function for pluralization
export const usePlural = () => {
  const { t, currentLanguage } = useTranslation();
  
  const getJobText = (count: number): string => {
    if (currentLanguage === 'he') {
      return count === 1 ? 'משימה' : 'משימות';
    } else {
      return count === 1 ? 'job' : 'jobs';
    }
  };

  return { getJobText };
};