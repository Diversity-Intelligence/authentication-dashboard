import { getApiUrl, useFetchData } from 'utils';

export type UserRolesResponse =
  | {
      status: 'OK';
      roles: string[];
    }
  | {
      status: 'FEATURE_NOT_ENABLED_ERROR';
    };

export const useUserRolesService = () => {
  const fetchData = useFetchData();

  const addRoleToUser = async (
    userId: string,
    role: string,
    tenantId: string,
  ): Promise<
    | {
        status: 'OK' | 'UNKNOWN_ROLE_ERROR';
      }
    | undefined
  > => {
    const response = await fetchData({
      url: getApiUrl('/api/userroles/user/roles', tenantId),
      method: 'PUT',
      config: {
        body: JSON.stringify({
          userId,
          role,
        }),
      },
    });

    if (response.ok) {
      const body = await response.json();
      return body;
    }

    return undefined;
  };

  const getRolesForUser = async (
    userId: string,
    tenantId: string,
  ): Promise<UserRolesResponse | undefined> => {
    const response = await fetchData({
      url: getApiUrl('/api/userroles/user/roles', tenantId),
      method: 'GET',
      query: {
        userId,
      },
    });

    if (response.ok) {
      const body = await response.json();
      return body;
    }

    return undefined;
  };

  const removeUserRole = async (
    userId: string,
    role: string,
    tenantId: string,
  ): Promise<
    | {
        status: 'OK';
      }
    | {
        status: 'UNKNOWN_ROLE_ERROR';
      }
    | undefined
  > => {
    const response = await fetchData({
      url: getApiUrl('/api/userroles/user/roles', tenantId),
      method: 'DELETE',
      query: {
        userId,
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
    addRoleToUser,
    getRolesForUser,
    removeUserRole,
  };
};
