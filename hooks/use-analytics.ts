import { useMemo } from 'react';
export const useAnalytics = (expenses: any[]) => {
  return useMemo(() => ({ total: expenses.length }), [expenses]);
};
