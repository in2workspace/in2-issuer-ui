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
          mandatee: {
            first_name: 'Joe',
            last_name: 'Doe',
            email: 'fdsad@email.com',
            mobile_phone: '605444888'
          },
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
            { tmf_action: ['Update, Create'], tmf_domain: 'domain1', tmf_function: 'ProductOffering', tmf_type: 'type1' },
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