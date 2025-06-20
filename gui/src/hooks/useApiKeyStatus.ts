import { useSettings } from './useApi';

/**
 * Hook to check if the OpenAI API key is set
 * @returns Object containing isApiKeySet status and loading state
 */
export function useApiKeyStatus() {
  const { settings, loading, error } = useSettings();
  
  // Check if the API key is set and not empty
  const isApiKeySet = Boolean(settings?.openai_api_key);
  
  return { isApiKeySet, loading, error };
}