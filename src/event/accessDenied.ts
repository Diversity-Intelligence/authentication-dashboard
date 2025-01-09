export const DASHBOARD_ACCESS_DENIED_EVENT = 'dashboard-access-denied';

export const getAccessDeniedEvent = (message: string) => {
  return new CustomEvent(DASHBOARD_ACCESS_DENIED_EVENT, {
    detail: {
      message,
    },
  });
};
