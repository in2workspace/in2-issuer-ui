import routes from './credential-management.routes';
import { CredentialManagementComponent } from './credential-management.component';
import { CredentialDetailsComponent } from '../credential-details/credential-details.component';

describe('Credential Management Routes', () => {
  it('should define routes with correct components and paths', () => {
    expect(routes.length).toBe(2);

    const rootRoute = routes.find(r => r.path === '');
    expect(rootRoute).toBeTruthy();
    expect(rootRoute!.component).toBe(CredentialManagementComponent);

    const detailsRoute = routes.find(r => r.path === 'details/:id');
    expect(detailsRoute).toBeTruthy();
    expect(detailsRoute!.component).toBe(CredentialDetailsComponent);
  });
});
