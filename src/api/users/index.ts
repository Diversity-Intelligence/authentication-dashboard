import { getApiUrl, useFetchData } from 'utils';
import { LIST_DEFAULT_LIMIT } from '../../ui/components/usersListTable/UsersListTable';
import { UserPaginationList } from '../../ui/pages/usersList/types';

interface IUseFetchUsersService {
  fetchUsers: (
    param?: { paginationToken?: string; limit?: number },
    search?: object,
    tenantId?: string,
  ) => Promise<UserPaginationList | undefined>;
}

export const useFetchUsersService = (): IUseFetchUsersService => {
  const fetchData = useFetchData();
  const fetchUsers = async (
    param?: { paginationToken?: string; limit?: number },
    search?: object,
    tenantId?: string,
  ) => {
    let query = {};
    if (search) {
      query = { ...search };
    }
    if (param && Object.keys(param).includes('paginationToken')) {
      query = { ...query, paginationToken: param?.paginationToken };
    }
    if (param && Object.keys(param).includes('limit')) {
      query = { ...query, limit: param?.limit };
    } else {
      query = { ...query, limit: LIST_DEFAULT_LIMIT };
    }
    const response = await fetchData({
      url: getApiUrl('/api/users', tenantId),
      method: 'GET',
      query: query,
    });
    return response.ok
      ? ((await response?.json()) as UserPaginationList)
      : undefined;
  };
  return { fetchUsers };
};

export default useFetchUsersService;

export * from './count';
