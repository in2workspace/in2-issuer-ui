import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { CredentialOfferOnboardingComponent } from './features/credential-offer-onboarding/credential-offer-onboarding.component';
import { OnboardingPolicy } from './core/policies/onboarding-policy';
import { routes } from "./app-routing";

describe('App Routes', () => {
  it('should contain a default redirect to home', () => {
    const defaultRoute = routes.find((route) => route.path === '' && route.redirectTo === 'home');
    expect(defaultRoute).toBeTruthy();
    expect(defaultRoute?.pathMatch).toBe('full');
  });

  it('should define lazy loading for the home module', () => {
    const homeRoute = routes.find((route) => route.path === 'home');
    expect(homeRoute).toBeTruthy();
    expect(homeRoute?.loadChildren).toBeDefined();
    expect(typeof homeRoute?.loadChildren).toBe('function');
  });

  it('should define lazy loading for credential management with guards', () => {
    const orgCredRoute = routes.find((route) => route.path === 'organization/credentials');
    expect(orgCredRoute).toBeTruthy();
    expect(orgCredRoute?.loadChildren).toBeDefined();
    expect(orgCredRoute?.canActivate).toContain(AutoLoginPartialRoutesGuard);
    expect(orgCredRoute?.canActivate).toContain(OnboardingPolicy);
  });

  it('should define lazy loading for credential issuance with guards', () => {
    const createCredRoute = routes.find((route) => route.path === 'organization/credentials/create');
    expect(createCredRoute).toBeTruthy();
    expect(createCredRoute?.loadChildren).toBeDefined();
    expect(createCredRoute?.canActivate).toContain(AutoLoginPartialRoutesGuard);
    expect(createCredRoute?.canActivate).toContain(OnboardingPolicy);
  });

  it('should define a component route for credential-offer', () => {
    const credentialOfferRoute = routes.find((route) => route.path === 'credential-offer');
    expect(credentialOfferRoute).toBeTruthy();
    expect(credentialOfferRoute?.component).toBe(CredentialOfferOnboardingComponent);
  });

  it('should redirect wildcard (**) to home', () => {
    const wildcardRoute = routes.find((route) => route.path === '**');
    expect(wildcardRoute).toBeTruthy();
    expect(wildcardRoute?.redirectTo).toBe('home');
  });
});
