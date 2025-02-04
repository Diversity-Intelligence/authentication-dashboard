/* Copyright (c) 2024, VRAI Labs and/or its affiliates. All rights reserved.
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
import { useDeleteThirdPartyProviderService } from 'api/tenants';
import { PopupContentContext } from '../../../../contexts/PopupContentContext';
import Button from '../../../button';
import { Dialog, DialogContent, DialogFooter } from '../../../dialog';
import { useTenantDetailContext } from '../TenantDetailContext';
import './deleteThirdPartyProvider.scss';

export const DeleteThirdPartyProviderDialog = ({
  onCloseDialog,
  thirdPartyId,
  goBack,
}: {
  onCloseDialog: () => void;
  goBack: () => void;
  thirdPartyId: string;
}) => {
  const [isDeletingProvider, setIsDeletingProvider] = useState(false);
  const deleteThirdPartyProvider = useDeleteThirdPartyProviderService();
  const { tenantInfo, refetchTenant } = useTenantDetailContext();
  const { showToast } = useContext(PopupContentContext);

  const handleDeleteProperty = async () => {
    try {
      setIsDeletingProvider(true);
      const res = await deleteThirdPartyProvider(
        tenantInfo.tenantId,
        thirdPartyId,
      );
      await refetchTenant();
      if (res.status === 'OK') {
        onCloseDialog();
        goBack();
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      showToast({
        iconImage: getImageUrl('form-field-error-icon.svg'),
        children: 'Something went wrong. Please try again.',
        toastType: 'error',
      });
    } finally {
      setIsDeletingProvider(false);
    }
  };

  return (
    <Dialog
      title={'Delete Provider?'}
      onCloseDialog={onCloseDialog}
    >
      <DialogContent>
        <p className='confirm-text'>
          <>
            Are you sure you want to delete the provider:{' '}
            <span className='third-party-id'>{thirdPartyId}</span>
          </>
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
            isLoading={isDeletingProvider}
            disabled={isDeletingProvider}
            onClick={handleDeleteProperty}
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
