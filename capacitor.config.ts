import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Credential-issuer-ui',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
