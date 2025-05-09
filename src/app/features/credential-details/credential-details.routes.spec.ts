import routes from './credential-details.routes';
import { CredentialDetailsComponent } from './credential-details.component';

describe('Credential Details Routes', () => {
  it('should define a single route with path ":id" and correct component', () => {
    expect(routes.length).toBe(1);

    const route = routes[0];
    expect(route.path).toBe(':id');
    expect(route.component).toBe(CredentialDetailsComponent);
  });
});
