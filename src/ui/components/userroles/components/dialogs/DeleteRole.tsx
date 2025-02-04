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
import { useContext, useState } from 'react';
import { getImageUrl } from 'utils';
import useRolesService from 'api/userroles/role';
import { PopupContentContext } from '../../../../contexts/PopupContentContext';
import Button from '../../../button';
import { Dialog, DialogContent, DialogFooter } from '../../../dialog';
import './deleteRole.scss';

export default function DeleteRoleDialog({
  currentlySelectedRoleName,
  deleteRole: deleteRoleFromState,
  onCloseDialog,
}: {
  currentlySelectedRoleName: string;
  deleteRole: (role: string) => void;
  onCloseDialog: () => void;
}) {
  const { showToast } = useContext(PopupContentContext);
  const { deleteRole } = useRolesService();

  const [isDeletingRoles, setIsDeletingRoles] = useState(false);

  async function handleDeleteRoles() {
    setIsDeletingRoles(true);

    try {
      await deleteRole(currentlySelectedRoleName);
      showToast({
        iconImage: getImageUrl('checkmark-green.svg'),
        toastType: 'success',
        children: 'Role deleted successfully!',
      });
      deleteRoleFromState(currentlySelectedRoleName);
      onCloseDialog();
    } catch (_) {
      showToast({
        iconImage: getImageUrl('form-field-error-icon.svg'),
        toastType: 'error',
        children: <>Something went wrong Please try again!</>,
      });
    } finally {
      setIsDeletingRoles(false);
    }
  }

  return (
    <Dialog
      title='Delete Roles?'
      onCloseDialog={onCloseDialog}
    >
      <DialogContent>
        <p className='you-sure-text'>
          Are you sure you want to delete Role:{' '}
          <span className='red'>{currentlySelectedRoleName}</span>? This action
          is irreversible.
        </p>
        <DialogFooter border='border-none'>
          <Button
            onClick={onCloseDialog}
            color='gray-outline'
          >
            Cancel
          </Button>
          <Button
            color='danger'
            isLoading={isDeletingRoles}
            disabled={isDeletingRoles}
            onClick={handleDeleteRoles}
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
