import { useMutation, useQueryClient } from 'react-query';
import { fetchJson } from '../lib/api';

const USER_QUERY_KEY = 'createProfile';

export function useCreateProfile() {
    const queryClient = useQueryClient();
    const mutation = useMutation((profile) => fetchJson('/api/create-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }));
    return {
      createProfile: async (profile) => {
        try {
          const result = await mutation.mutateAsync(profile);
          queryClient.setQueryData(USER_QUERY_KEY, result);
          return true;
        } catch (err) {
          return false;
        }
      },
      createProfileError: mutation.isError,
      createProfileLoading: mutation.isLoading,
    };
}