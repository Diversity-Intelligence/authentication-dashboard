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
import { IN_BUILT_THIRD_PARTY_PROVIDERS } from 'consts';
import { plus as PlusIcon } from 'assets';
import Button from '../../button';
import { useTenantDetailContext } from './TenantDetailContext';
import {
  PanelHeader,
  PanelHeaderTitleWithTooltip,
  PanelRoot,
} from './tenantDetailPanel/TenantDetailPanel';
import { ThirdPartyProviderButton } from './thirdPartyProviderButton/ThirdPartyProviderButton';

export const ThirdPartySection = ({
  handleAddNewProvider,
  handleEditProvider,
}: {
  handleAddNewProvider: () => void;
  handleEditProvider: (providerId: string) => void;
}) => {
  const { tenantInfo } = useTenantDetailContext();
  const providers = tenantInfo.thirdParty.providers;
  return (
    <PanelRoot>
      <PanelHeader>
        <PanelHeaderTitleWithTooltip tooltip='Configure third-party OAuth 2.0/OIDC/SAML providers available for user sign-in/sign-up'>
          Social/Enterprise Providers
        </PanelHeaderTitleWithTooltip>
      </PanelHeader>

      {providers?.length > 0 ? (
        <div className='tenant-detail__existing-providers'>
          {providers.map((provider) => {
            const builtInProvider = IN_BUILT_THIRD_PARTY_PROVIDERS.find((p) =>
              provider.thirdPartyId.startsWith(p.id),
            );

            if (builtInProvider) {
              return (
                <ThirdPartyProviderButton
                  key={provider.thirdPartyId}
                  title={provider.name ?? provider.thirdPartyId}
                  icon={builtInProvider.icon}
                  onClick={() => handleEditProvider(provider.thirdPartyId)}
                />
              );
            }
            return (
              <ThirdPartyProviderButton
                key={provider.thirdPartyId}
                title={provider.name ?? provider.thirdPartyId}
                type='without-icon'
                onClick={() => handleEditProvider(provider.thirdPartyId)}
              />
            );
          })}
        </div>
      ) : (
        <>
          No providers are configured for this tenant. Add at least one provider
          to be able to use third-party login.
        </>
      )}

      <hr className='tenant-detail__third-party-divider' />

      <Button onClick={handleAddNewProvider}>
        <PlusIcon />
        Add new Provider
      </Button>
    </PanelRoot>
  );
};
