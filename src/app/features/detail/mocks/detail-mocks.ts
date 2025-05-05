import { LearCredentialDataDetail } from '../models/detail-models';

export const mockCredentialEmployee: LearCredentialDataDetail = {
  procedure_id: 'mock-procedure-employee',
  credential_status: 'WITHDRAWN',
  credential: {
    sub: 'subject-id-emp',
    nbf: '2024-01-01T00:00:00Z',
    iss: 'issuer-id',
    exp: '2025-01-01T00:00:00Z',
    iat: '2024-01-01T00:00:00Z',
    jti: 'mock-jti-emp',
    vc: {
      id: 'cred-emp',
      type: ['LEARCredentialEmployee'],
      description: 'Mock employee credential',
      issuer: {
        id: 'issuer-emp',
        commonName: 'Employee Issuer',
        country: 'ES',
        organization: 'Org EMP',
        organizationIdentifier: 'IDentifier Org',
        emailAddress: 'email',
        serialNumber: 'SERIAL-NUMBER'
      },
      credentialSubject: {
        mandate: {
          id: 'mandate-emp',
          life_span: { start: '2024-01-01', end: '2025-01-01' },
          mandatee: {
            id: 'emp-1', email: 'emp@example.com', firstName: 'Emp', lastName: 'Loyee',
            mobile_phone: '+34000000000', nationality: 'ES'
          },
          mandator: {
            commonName: 'Mandator EMP', country: 'ES', emailAddress: 'mandator@emp.com',
            organization: 'Org Mandator', organizationIdentifier: 'ORG-MAN-EMP', serialNumber: 'SN-EMP'
          },
          power: [
            { id: 'p1', tmf_action: ['Execute'], tmf_domain: 'DOME', tmf_function: 'OnBoarding', tmf_type: 'Domain' },
            { id: 'p1', tmf_action: ['Update'], tmf_domain: 'DOME', tmf_function: 'ProductOffering', tmf_type: 'Domain' },
          ],
          signer: {
            commonName: 'Signer EMP', country: 'ES', emailAddress: 'signer@emp.com',
            organization: 'SignerOrg', organizationIdentifier: 'SIGN-EMP', serialNumber: 'SN-SIGN-EMP'
          }
        }
      },
      validFrom: '2024-01-01',
      validUntil: '2025-01-01'
    }
  }
};

export const mockCredentialMachine: LearCredentialDataDetail = {
  procedure_id: 'mock-procedure-machine',
  credential_status: 'PEND_SIGNATURE',
  credential: {
    sub: 'subject-id-mac',
    nbf: '2024-01-01T00:00:00Z',
    iss: 'issuer-id',
    exp: '2025-01-01T00:00:00Z',
    iat: '2024-01-01T00:00:00Z',
    jti: 'mock-jti-mac',
    vc: {
      id: 'cred-mac',
      type: ['LEARCredentialMachine'],
      description: 'Mock machine credential',
      issuer: {
        id: 'issuer-mac',
        commonName: 'Machine Issuer',
        country: 'DE',
        organization: 'Org MAC',
        organizationIdentifier: 'IDentifier Org',
        emailAddress: 'email',
        serialNumber: 'SERIAL-NUMBER'
      },
      credentialSubject: {
        mandate: {
          id: 'mandate-mac',
          life_span: { start: '2024-01-01', end: '2025-01-01' },
          mandatee: {
            id: 'machine-1', serviceName: 'Service X', serviceType: 'API',
            version: '1.0', domain: 'cloud', ipAddress: '192.168.0.1',
            description: 'Main processing unit',
            contact: { email: 'contact@machine.com', phone: '+34999999999' }
          },
          mandator: {
            commonName: 'Mandator MAC', country: 'DE', emailAddress: 'mandator@mac.com',
            organization: 'Org Mandator MAC', organizationIdentifier: 'ORG-MAN-MAC', serialNumber: 'SN-MAC'
          },
          power: [
            { id: 'p2', tmf_action: ['Execute'], tmf_domain: 'infra', tmf_function: 'OnBoarding', tmf_type: 'perm' }
          ],
          signer: {
            commonName: 'Signer MAC', country: 'DE', emailAddress: 'signer@mac.com',
            organization: 'SignerOrgMac', organizationIdentifier: 'SIGN-MAC', serialNumber: 'SN-SIGN-MAC'
          }
        }
      },
      validFrom: '2024-01-01',
      validUntil: '2025-01-01'
    }
  }
};

export const mockCredentialCertification: LearCredentialDataDetail = {
  procedure_id: 'mock-procedure-cert',
  credential_status: 'PEND_DOWNLOAD',
  credential: {
    sub: 'subject-id-cert',
    nbf: '2024-01-01T00:00:00Z',
    iss: 'issuer-id',
    exp: '2025-01-01T00:00:00Z',
    iat: '2024-01-01T00:00:00Z',
    jti: 'mock-jti-cert',
    vc: {
      id: 'cred-cert',
      type: ['VerfiableCertification'],
      issuer: {
        id: 'issuer-cert',
        commonName: 'Cert Issuer',
        country: 'FR',
        organization: 'Org CERT'
      },
      credentialSubject: {
        company: {
          id: 'company-1',
          commonName: 'Test Company',
          organization: 'Test Org',
          country: 'FR',
          email: 'info@company.com',
          address: '123 Rue Example'
        },
        compliance: [
          { id: 'comp1', hash: 'abc123', scope: 'full', standard: 'ISO9001' }
        ],
        product: {
          productId: 'prod-1',
          productName: 'SuperWidget',
          productVersion: '2.3'
        }
      },
      atester: {
        id: 'tester-1',
        organization: 'AuditCo',
        organizationIdentifier: 'AUD123',
        firstName: 'Audrey',
        lastName: 'Test',
        country: 'FR'
      },
      validFrom: '2024-01-01',
      validUntil: '2025-01-01',
      signer: {
        commonName: 'Signer CERT',
        country: 'FR',
        emailAddress: 'signer@cert.com',
        organization: 'SignerCertOrg',
        organizationIdentifier: 'SIGN-CERT',
        serialNumber: 'SN-CERT-123'
      }
    }
  }
};
