import routes from './credential-details.routes';
import { CredentialDetailsComponent } from './credential-details.component';

describe('Credential Details Routes', () => {
  it('should contain the expected route configuration', () => {
    for (const route of routes) {
      expect(route).toHaveProperty('path', ':id');
      expect(route.component).toBe(CredentialDetailsComponent);
    }
  });
});
