import { noTenants as NoTenantsFound } from 'assets';
import './noTenants.scss';

export const NoTenants = () => {
  return (
    <section className='not-found-container'>
      <div>
        <NoTenantsFound />
        <h2>No tenants found</h2>
        <p>Can’t find the tenant you are looking for!</p>
      </div>
    </section>
  );
};
