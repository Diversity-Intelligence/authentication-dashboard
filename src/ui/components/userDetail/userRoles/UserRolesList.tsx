/* Copyright (c) 2022, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { useContext, useEffect, useState } from 'react';
import { plusSquare as PlusSquareIcon } from 'assets';
import { cross as CrossIcon } from 'assets';
import { getImageUrl } from 'utils';
import { useUserRolesService } from 'api/userroles/user/roles';
import { PopupContentContext } from '../../../contexts/PopupContentContext';
import Alert from '../../alert/alert';
import Badge from '../../badge';
import { LayoutPanel } from '../../layout/layoutPanel';
import Select from '../../select';
import Shimmer from '../../shimmer';
import AssignRolesDialog from '../../userroles/components/dialogs/AssignRoles';
import DeleteUserRoleDialog from '../../userroles/components/dialogs/DeleteUserRole';
import { useUserDetailContext } from '../context/UserDetailContext';
import { UserRolesListHeader } from './UserRolesListHeader';
import './userRolesList.scss';

export default function UserRolesList() {
  const { getRolesForUser } = useUserRolesService();
  const { userDetail } = useUserDetailContext();
  const { showToast } = useContext(PopupContentContext);

  const [assignedRoles, setAssignedRoles] = useState<string[] | undefined>(
    undefined,
  );
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean | undefined>(
    undefined,
  );

  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<undefined | string>(
    undefined,
  );
  const [showDeleteRoleDialog, setShowDeleteDialogRole] = useState(false);

  const tenantIdsThatUserIsPartOf = userDetail.details.tenantIds;

  const defaultTenantId =
    tenantIdsThatUserIsPartOf.find((id) => id === 'public') !== undefined
      ? 'public'
      : tenantIdsThatUserIsPartOf[0];

  const [currentlySelectedTenantId, setCurrentlySelectedTenantId] =
    useState(defaultTenantId);

  const isLoading =
    isFeatureEnabled === undefined && assignedRoles === undefined;

  const [isEditing, setIsEditing] = useState(false);

  async function fetchUserRoles() {
    setAssignedRoles(undefined);
    setIsFeatureEnabled(undefined);
    setIsEditing(false);

    const response = await getRolesForUser(
      userDetail.userId,
      currentlySelectedTenantId,
    );
    if (response !== undefined) {
      if (response.status === 'OK') {
        setIsFeatureEnabled(true);
        setAssignedRoles(response.roles);
      } else if (response.status === 'FEATURE_NOT_ENABLED_ERROR') {
        setIsFeatureEnabled(false);
        setAssignedRoles(undefined);
      }
    } else {
      showToast({
        iconImage: getImageUrl('form-field-error-icon.svg'),
        toastType: 'error',
        children: <>Something went wrong Please try again!</>,
      });
    }
  }

  useEffect(() => {
    void fetchUserRoles();
  }, [currentlySelectedTenantId]);

  return (
    <LayoutPanel
      header={
        <UserRolesListHeader
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          isFeatureEnabled={isFeatureEnabled}
        />
      }
    >
      <div className='user-roles-list-wrapper'>
        <>
          {isLoading || isFeatureEnabled ? (
            <div className='select-tenantId-container'>
              All roles assigned to the user for tenant:{' '}
              {tenantIdsThatUserIsPartOf.length > 1 ? (
                <Select
                  onOptionSelect={setCurrentlySelectedTenantId}
                  options={tenantIdsThatUserIsPartOf.map((id) => {
                    return { name: id, value: id };
                  })}
                  selectedOption={currentlySelectedTenantId}
                />
              ) : (
                <span>{currentlySelectedTenantId}</span>
              )}
            </div>
          ) : null}
          {isLoading ? (
            <div className='shimmer-container'>
              <Shimmer />
              <Shimmer />
              <Shimmer />
            </div>
          ) : isFeatureEnabled && assignedRoles !== undefined ? (
            <>
              {isEditing ? (
                <div className='roles-list-container'>
                  {assignedRoles.map((role) => {
                    return (
                      <Badge
                        key={role}
                        type='success'
                        text={role}
                      >
                        <CrossIcon
                          onClick={() => {
                            setRoleToDelete(role);
                            setShowDeleteDialogRole(true);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  <button
                    className='add-role-btn'
                    onClick={() => setShowAddRoleDialog(true)}
                  >
                    Assign Role <PlusSquareIcon />
                  </button>
                </div>
              ) : (
                <div className='roles-list-container'>
                  {assignedRoles.length < 1 ? (
                    <button
                      data-disable-hover='true'
                      className='add-role-btn'
                    >
                      No assigned User Roles
                    </button>
                  ) : null}
                  {assignedRoles.map((role) => {
                    return (
                      <Badge
                        key={role}
                        type='success'
                        text={role}
                      />
                    );
                  })}
                </div>
              )}
              {showAddRoleDialog ? (
                <AssignRolesDialog
                  currentlySelectedTenantId={currentlySelectedTenantId}
                  userId={userDetail.userId}
                  assignedRoles={assignedRoles}
                  setAssignedRoles={setAssignedRoles}
                  onCloseDialog={() => setShowAddRoleDialog(false)}
                />
              ) : null}
              {showDeleteRoleDialog && roleToDelete !== undefined ? (
                <DeleteUserRoleDialog
                  currentlySelectedTenantId={currentlySelectedTenantId}
                  roleToDelete={roleToDelete}
                  userId={userDetail.userId}
                  assignedRoles={assignedRoles}
                  setAssignedRoles={setAssignedRoles}
                  onCloseDialog={() => {
                    setRoleToDelete(undefined);
                    setShowDeleteDialogRole(false);
                  }}
                />
              ) : null}
            </>
          ) : (
            <Alert title='Feature is not enabled'>
              Enable this feature to manage user roles and permissions. Start by
              initializing the UserRoles recipe in the recipeList on the
              backend. For more details, see{' '}
              <a href='https://supertokens.com/docs/userdashboard/managing-user-roles-and-permissions'>
                this page.
              </a>
            </Alert>
          )}
        </>
      </div>
    </LayoutPanel>
  );
}
