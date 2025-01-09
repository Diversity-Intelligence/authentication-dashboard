import { getApiUrl, useFetchData } from 'utils';

type GetRolesResponse =
  | {
      status: 'OK';
      roles: string[];
    }
  | {
      status: 'FEATURE_NOT_ENABLED_ERROR';
    };

export const useRolesService = () => {
  const fetchData = useFetchData();

  const getRoles = async (): Promise<GetRolesResponse | undefined> => {
    const response = await fetchData({
      url: getApiUrl('/api/userroles/roles'),
      method: 'GET',
    });

    if (response.ok) {
      const body = await response.json();
      return body;
    }

    return undefined;
  };

  const createRoleOrUpdateARole = async (
    role: string,
    permissions: string[],
  ): Promise<
    | { status: 'OK'; createdNewRole: boolean }
    | { status: 'FEATURE_NOT_ENABLED_ERROR' | 'UNKNOWN_ROLE_ERROR' }
    | undefined
  > => {
    const response = await fetchData({
      url: getApiUrl('/api/userroles/role'),
      method: 'PUT',
      config: {
        body: JSON.stringify({
          role,
          permissions,
        }),
      },
    });

    if (response.ok) {
      const body = await response.json();
      return body;
    }

    return undefined;
  };

  const deleteRole = async (
    role: string,
  ): Promise<
    | {
        status: 'OK';
        didRoleExist: boolean;
      }
    | {
        status: 'FEATURE_NOT_ENABLED_ERROR';
      }
    | undefined
  > => {
    const response = await fetchData({
      url: getApiUrl('/api/userroles/role'),
      method: 'DELETE',
      query: {
        role,
      },
    });

    if (response.ok) {
      const body = await response.json();
      return body;
    }

    return undefined;
  };

  return {
    getRoles,
    createRoleOrUpdateARole,
    deleteRole,
  };
};

export default useRolesService;

export * from './permissions';
