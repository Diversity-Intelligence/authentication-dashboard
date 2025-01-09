import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthWrapper from './ui/components/authWrapper';
import ErrorBoundary from './ui/components/errorboundary';
import { AccessDeniedModal } from './ui/components/layout/accessDeniedModal';
import { LayoutModalContainer } from './ui/components/layout/layoutModal';
import SafeAreaView from './ui/components/safeAreaView/SafeAreaView';
import { ToastNotificationContainer } from './ui/components/toast/toastNotification';
import { AccessDeniedContextProvider } from './ui/contexts/AccessDeniedContext';
import { PopupContentContextProvider } from './ui/contexts/PopupContentContext';
import { TenantsListContextProvider } from './ui/contexts/TenantsListContext';
import MainLayout from './ui/layouts/mainLayout';
import TenantManagement from './ui/pages/tenants';
import UserRolesList from './ui/pages/userroles';
import UsersListPage from './ui/pages/usersList/UsersList';
import { getDashboardAppBasePath } from './utils';

function App() {
  return (
    <>
      <SafeAreaView />
      <ErrorBoundary>
        <PopupContentContextProvider>
          <AccessDeniedContextProvider>
            <TenantsListContextProvider>
              <AuthWrapper>
                <Router basename={getDashboardAppBasePath()}>
                  <MainLayout>
                    <Routes>
                      <Route
                        path='/'
                        element={<UsersListPage />}
                      />
                      <Route
                        path='/roles'
                        element={<UserRolesList />}
                      />
                      <Route
                        path='/tenants'
                        element={<TenantManagement />}
                      />
                      <Route
                        path='*'
                        element={<UsersListPage />}
                      />
                    </Routes>
                  </MainLayout>
                </Router>
                <AccessDeniedModal />
                <ToastNotificationContainer />
                <LayoutModalContainer />
              </AuthWrapper>
            </TenantsListContextProvider>
          </AccessDeniedContextProvider>
        </PopupContentContextProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
