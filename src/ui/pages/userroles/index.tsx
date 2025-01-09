import { useContext, useEffect, useState } from 'react';
import { plus as PlusIcon } from 'assets';
import { getImageUrl } from 'utils';
import useRolesService from 'api/userroles/role';
import Alert from '../../components/alert/alert';
import Button from '../../components/button';
import { RolesTable } from '../../components/userroles/components/RolesTable';
import CreateNewRole from '../../components/userroles/components/dialogs/CreateNewRole';
import { AppEnvContextProvider } from '../../contexts/AppEnvContext';
import { PopupContentContext } from '../../contexts/PopupContentContext';
import './index.scss';

export const USERROLES_PAGINATION_LIMIT = 10;

export type PaginationData = {
  totalPages: number;
  totalRolesCount: number;
};

export type RoleWithOrWithoutPermissions = {
  role: string;
  //	 undefined suggests that the permissions for this particular role is not being fetched on client.
  permissions: undefined | string[];
};

export default function UserRolesList() {
  //	boolean to check whether the roles and permissions recipe is enabled or not.
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean | undefined>(
    undefined,
  );

  const { getRoles } = useRolesService();
  const { showToast } = useContext(PopupContentContext);

  // used to store roles with permissions data that are fetched on the client side.
  const [roles, setRoles] = useState<
    RoleWithOrWithoutPermissions[] | undefined
  >(undefined);

  //	used to control opening and closing dialog
  const [showCreateNewRoleDialogOpen, setShowCreateNewRoleDialogOpen] =
    useState(false);

  //	used to track active page user is on.
  const [currentActivePage, setCurrentActivePage] = useState(1);

  //	pagination related.
  const totalRolesCount = roles !== undefined ? roles.length : 0;
  const totalPages = Math.ceil(totalRolesCount / USERROLES_PAGINATION_LIMIT);

  const fetchRoles = async () => {
    try {
      const response = await getRoles();

      if (response !== undefined) {
        if (response.status === 'OK') {
          //	reversing roles response to show latest roles first.
          const rolesWithUndefinedPermissions = response.roles
            .reverse()
            .map((role) => {
              return {
                role,
                //	by default every role has permissions as undefined.
                permissions: undefined,
              };
            });
          setRoles(rolesWithUndefinedPermissions);
          setIsFeatureEnabled(true);
        }

        if (response.status === 'FEATURE_NOT_ENABLED_ERROR') {
          setIsFeatureEnabled(false);
        }
      } else {
        showToast({
          iconImage: getImageUrl('form-field-error-icon.svg'),
          toastType: 'error',
          children: <>Something went wrong Please try again!</>,
        });
      }
    } catch (_) {
      showToast({
        iconImage: getImageUrl('form-field-error-icon.svg'),
        toastType: 'error',
        children: <>Something went wrong Please try again!</>,
      });
    }
  };

  useEffect(() => {
    //	void represent this function returns nothing.
    void fetchRoles();
  }, []);

  function renderContent() {
    if (isFeatureEnabled === false) {
      return (
        <Alert title='Feature is not enabled'>
          Enable this feature to manage user roles and permissions. Start by
          initializing the UserRoles recipe in the recipeList on the backend.
          For more details, see{' '}
          <a href='https://supertokens.com/docs/userdashboard/managing-user-roles-and-permissions'>
            this page.
          </a>
        </Alert>
      );
    }

    return (
      <>
        <div className='search-add-role-container'>
          <Button
            disabled={roles === undefined}
            onClick={() => setShowCreateNewRoleDialogOpen(true)}
            color='secondary'
          >
            <PlusIcon />
            Add Role
          </Button>
          {showCreateNewRoleDialogOpen && roles !== undefined ? (
            <CreateNewRole
              addRoleToReponseData={(role) => setRoles([role, ...roles])}
              onCloseDialog={() => setShowCreateNewRoleDialogOpen(false)}
            />
          ) : null}
        </div>
        <RolesTable
          setCurrentActivePage={setCurrentActivePage}
          setRoles={setRoles}
          currentActivePage={currentActivePage}
          paginationData={{
            totalPages,
            totalRolesCount,
          }}
          roles={roles}
        />
      </>
    );
  }

  return (
    <AppEnvContextProvider
      connectionURI={
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).connectionURI
      }
    >
      <div className='userroles-container'>
        <h1 className='users-list-title'>Roles and Permissions</h1>
        <p className='text-small users-list-subtitle'>
          One place to manage all your user roles and permissions. Edit roles
          and permissions according to your needs.
        </p>
        {renderContent()}
      </div>
    </AppEnvContextProvider>
  );
}
