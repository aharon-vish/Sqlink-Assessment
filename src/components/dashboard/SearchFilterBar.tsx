import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Input, Button } from '@/components/ui';
import { useJobStore } from '@/stores/jobStore';
import { getJobStatusLabel } from '@/types/enums';
import { useTranslation } from '@/hooks/useTranslation';

const FilterBarContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 20px;
    margin-bottom: 24px;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #718096;
  min-width: fit-content;
`;

const ActiveFilter = styled.span`
  background: #3182ce;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const ClearButton = styled(Button)`
  min-width: fit-content;
`;

// Debounce hook
const useDebounce = (callback: (value: string) => void, delay: number) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  const debouncedCallback = useCallback((value: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(value);
    }, delay);

    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);

  return debouncedCallback;
};

export const SearchFilterBar: React.FC = () => {
  const { t } = useTranslation();
  const { 
    filters, 
    setSearchTerm, 
    clearFilters,
    getFilteredJobs,
    jobs
  } = useJobStore();

  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm);

  // Debounced search
  const debouncedSearch = useDebounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClearFilters = () => {
    setLocalSearchTerm('');
    clearFilters();
  };

  const filteredJobs = getFilteredJobs();
  const hasActiveFilters = filters.status !== undefined || filters.searchTerm !== '';

  return (
    <FilterBarContainer>
      <SearchContainer>
        <Input
          type="text"
          placeholder={t('dashboard.searchPlaceholder')}
          value={localSearchTerm}
          onChange={handleSearchChange}
          data-testid="search-input"
        />
      </SearchContainer>

      <FilterInfo>
        <span>
          {t('dashboard.showingResults', { 
            count: filteredJobs.length, 
            total: jobs.length 
          })}
        </span>
        
        {filters.status !== undefined && (
          <ActiveFilter>
            {t('common.filter')}: {t(`jobStatus.${getJobStatusLabel(filters.status)}`)}
          </ActiveFilter>
        )}
        
        {filters.searchTerm && (
          <ActiveFilter>
            {t('common.search')}: "{filters.searchTerm}"
          </ActiveFilter>
        )}
      </FilterInfo>

      {hasActiveFilters && (
        <ClearButton 
          variant="secondary" 
          size="sm"
          onClick={handleClearFilters}
          data-testid="clear-filters-btn"
        >
          {t('dashboard.clearFilters')}
        </ClearButton>
      )}
    </FilterBarContainer>
  );
};