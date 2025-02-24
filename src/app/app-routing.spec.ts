import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { OnboardingPolicy, SettingsPolicy } from './core/policies/power-policies';
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

  it('should define a lazy loading route for credential-offer', () => {
    const createCredRoute = routes.find((route) => route.path === 'credential-offer');
    expect(createCredRoute).toBeTruthy();
    expect(createCredRoute?.loadChildren).toBeDefined();
  });
  it('should define lazy loading for settings with guards', () => {
    const settingsRoute = routes.find((route) => route.path === 'settings');
    expect(settingsRoute).toBeTruthy();
    expect(settingsRoute?.loadChildren).toBeDefined();
    expect(settingsRoute?.canActivate).toContain(AutoLoginPartialRoutesGuard);
    expect(settingsRoute?.canActivate).toContain(SettingsPolicy);
  });
  it('should redirect wildcard (**) to home', () => {
    const wildcardRoute = routes.find((route) => route.path === '**');
    expect(wildcardRoute).toBeTruthy();
    expect(wildcardRoute?.redirectTo).toBe('home');
  });


});
