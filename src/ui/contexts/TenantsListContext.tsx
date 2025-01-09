import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { getSelectedTenantId, setSelectedTenantId } from 'utils';
import { Tenant } from 'api/tenants/types';

type TenantsListContextType = {
  tenantsListFromStore: Tenant[] | undefined;
  setTenantsListToStore: (tenantsList: Tenant[]) => void;
  setSelectedTenant: (tenantId: string) => void;
  getSelectedTenant: () => string | undefined;
};

const TenantsListContext = createContext<TenantsListContextType | undefined>(
  undefined,
);

export const useTenantsListContext = () => {
  const context = useContext(TenantsListContext);
  if (!context) throw 'Context must be used within a provider!';
  return context;
};

export const TenantsListContextProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {
  const [tenantsListFromStore, setTenantsListToStore] = useState<
    Tenant[] | undefined
  >(undefined);
  const [selectedTenant, setSelectedTenant] = useState<string | undefined>(
    undefined,
  );

  const contextValue: TenantsListContextType = {
    tenantsListFromStore,
    setTenantsListToStore,
    setSelectedTenant: (tenantId: string) => {
      setSelectedTenantId(tenantId);
      setSelectedTenant(tenantId);
    },
    getSelectedTenant: () => {
      return getSelectedTenantId();
    },
  };

  return (
    <TenantsListContext.Provider value={contextValue}>
      {children}
    </TenantsListContext.Provider>
  );
};
