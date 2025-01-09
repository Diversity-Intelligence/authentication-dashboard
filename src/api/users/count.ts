import { getApiUrl, useFetchData } from 'utils';
import { UserListCount } from '../../ui/pages/usersList/types';

interface IUseFetchCountService {
  fetchCount: (tenantid?: string) => Promise<UserListCount | undefined>;
}

const useFetchCountService = (): IUseFetchCountService => {
  const fetchData = useFetchData();

  const fetchCount = async (tenantId?: string) => {
    const response = await fetchData({
      url: getApiUrl('/api/users/count', tenantId),
      method: 'GET',
    });

    return response.ok
      ? ((await response?.json()) as UserListCount)
      : undefined;
  };

  return {
    fetchCount,
  };
};

export default useFetchCountService;
