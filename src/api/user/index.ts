import { getApiUrl, useFetchData } from 'utils';
import { User } from '../../ui/pages/usersList/types';

interface IUseUserService {
  updateUserInformation: (
    args: IUpdateUserInformationArgs,
  ) => Promise<UpdateUserInformationResponse>;
  getUser: (userId: string) => Promise<GetUserInfoResult>;
}

export interface IUpdateUserInformationArgs {
  userId: string;
  recipeId: string;
  recipeUserId: string;
  tenantId: string | undefined;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export type GetUserInfoResult =
  | {
      status: 'NO_USER_FOUND_ERROR';
    }
  | {
      status: 'RECIPE_NOT_INITIALISED';
    }
  | {
      status: 'OK';
      user: User;
    };

export type UpdateUserInformationResponse =
  | {
      status:
        | 'OK'
        | 'EMAIL_ALREADY_EXISTS_ERROR'
        | 'PHONE_ALREADY_EXISTS_ERROR';
    }
  | {
      status: 'INVALID_EMAIL_ERROR' | 'INVALID_PHONE_ERROR';
      error: string;
    };

export const useUserService = (): IUseUserService => {
  const fetchData = useFetchData();

  const getUser = async (userId: string): Promise<GetUserInfoResult> => {
    const response = await fetchData({
      url: getApiUrl('/api/user'),
      method: 'GET',
      query: {
        userId,
      },
    });

    if (response.ok) {
      const body = await response.json();

      if (body.status === 'NO_USER_FOUND_ERROR') {
        return {
          status: 'NO_USER_FOUND_ERROR',
        };
      }

      if (body.status === 'RECIPE_NOT_INITIALISED') {
        return {
          status: 'RECIPE_NOT_INITIALISED',
        };
      }

      return body;
    }

    return {
      status: 'NO_USER_FOUND_ERROR',
    };
  };

  const updateUserInformation = async ({
    userId,
    recipeId,
    recipeUserId,
    email,
    phone,
    firstName,
    lastName,
    tenantId,
  }: IUpdateUserInformationArgs): Promise<UpdateUserInformationResponse> => {
    let emailToSend = email === undefined ? '' : email;
    const phoneToSend = phone === undefined ? '' : phone;
    const firstNameToSend = firstName === undefined ? '' : firstName;
    const lastNameToSend = lastName === undefined ? '' : lastName;

    if (recipeId === 'thirdparty') {
      emailToSend = '';
    }

    const response = await fetchData({
      url: getApiUrl('/api/user', tenantId),
      method: 'PUT',
      config: {
        body: JSON.stringify({
          recipeId,
          userId,
          recipeUserId,
          phone: phoneToSend,
          email: emailToSend,
          firstName: firstNameToSend,
          lastName: lastNameToSend,
        }),
      },
    });

    return await response.json();
  };

  return {
    updateUserInformation,
    getUser,
  };
};

export default useUserService;

export * from './delete';
export * from './metadata';
export * from './sessions';
export * from './unlink';
