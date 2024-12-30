import { LEARCredentialEmployeeJwtPayload } from '../models/entity/lear-credential-employee.entity';


export const credentialMock: LEARCredentialEmployeeJwtPayload = {
    sub: 'aaa',
    nbf: 'bbb',
    iss: 'fds',
    exp: 'dsa',
    iat: 'fdsad',
    vc: {
      id: 'id',
      type: ['type1', 'type2'],
      credentialSubject: {
        mandate: {
          id: 'idm',
          life_span: 'lifespan' as any,
          mandatee: {} as any,
          mandator: {
            organizationIdentifier: 'ORG123',
            organization: 'Test Organization',
            commonName: 'Test Common Name',
            emailAddress: 'test@example.com',
            serialNumber: '123456',
            country: 'Testland'
          },
          signer:{
            organizationIdentifier: "123456789",
            organization: "Tech Innovations Ltd.",
            commonName: "Tech Innovations",
            emailAddress: "contact@techinnovations.com",
            serialNumber: "SN-987654321",
            country: "ES"
          },
          power: [
            { tmf_action: 'action1', tmf_domain: 'domain1', tmf_function: 'function1', tmf_type: 'type1' },
            { tmf_action: 'action2', tmf_domain: 'domain2', tmf_function: 'function2', tmf_type: 'type2' }
          ]
        }
      },
      expirationDate: 'aa',
      issuanceDate: 'aa',
      issuer: 'aa',
      validFrom: 'aa',
    },
    jti: 'jti'
  }