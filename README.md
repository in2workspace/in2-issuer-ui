<div align="center">

<h1>Issuer-ui</h1>
<span>by </span><a href="https://in2.es">in2.es</a>
<p><p>


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=alert_status)](https://sonarcloud.io/dashboard?id=in2workspace_credential-issuer-ui)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=bugs)](https://sonarcloud.io/summary/new_code?id=in2workspace_credential-issuer-ui)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=in2workspace_credential-issuer-ui)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=security_rating)](https://sonarcloud.io/dashboard?id=in2workspace_credential-issuer-ui)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=in2workspace_credential-issuer-ui)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=ncloc)](https://sonarcloud.io/dashboard?id=in2workspace_credential-issuer-ui)

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=coverage)](https://sonarcloud.io/summary/new_code?id=in2workspace_credential-issuer-ui)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=in2workspace_credential-issuer-ui)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=in2workspace_credential-issuer-ui)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=in2workspace_credential-issuer-ui)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=in2workspace_credential-issuer-ui&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=in2workspace_credential-issuer-ui)

</div>

# Introduction
IN2 Issuer UI is the presentation side application for the IN2 Issuer project. It is a Angular application.

## Main Features
- Landing Page
- Login and register with conventional login
- Login and register with digital certificate
- Issued Credentials list view
- New Credential and New Credential as Signer forms
- Credential Details view

# Installation
As key part of the Credential Issuer solution the Issuer UI is designed to work with the following dependencies:
## Dependencies
To utilize the Credential Issuer, you will need the following components:

- **Issuer-UI**
- **Issuer-API**
- **Issuer Keycloak Plugin**
- **Postgres Database**
- **SMTP Email Server**

For each dependency, you can refer to their respective repositories for detailed setup instructions.
We offer a Docker image to run the application. You can find it in [Docker Hub](https://hub.docker.com/u/in2workspace).

Here, you can find an example of how to run the application with all the required services and configuration.
### Issuer UI
The application needs key custom environment variables to be configured
- LOGIN_URL: login url for your Keycloak realm
- CLIENT_ID: Keycloak client responsible for the registration
- WALLET_URL: Url of the Wallet application intended to be used to retrieve the credentials
- BASE_URL: base url of the Issuer API

#### Example of a typical configuration:
```
docker run -d \
  --name issuer-ui \
  -e LOGIN_URL=http://keycloak-external.org/realms/CredentialIssuer \
  -e CLIENT_ID=account-console \
  -e SCOPE="openid profile email offline_access" \
  -e GRANT_TYPE=code \
  -e BASE_URL=http://issuer-api.com/ \
  -e WALLET_URL=http://wallet.com/ \
  -p 4201:8080 \
  in2workspace/issuer-ui:v1.0.0
```

### Issuer API
The Server application of the Credential Issuer. Refer to the [Issuer API Documentation](https://github.com/in2workspace/issuer-api) for more information on configuration variables.

### Issuer Keycloak Plugin
Keycloak is used for identity and access management, as well as for other OpenID4VCI DOME profile requirements.
It's an implementation of the official quay.io keycloak image with a custom layer.
Refer to the [Keycloak Plugin Documentation](https://github.com/in2workspace/issuer-keycloak-plugin) for more information on setup and configuration variables.

### Postgres Database
Separate instances of Postgres are used as the database for Keycloak and the Issuer API.
You can find more information in the [official documentation](https://www.postgresql.org/docs/).

### SMTP Email Server
An SMTP Email Server of your choice. It must support StartTLS for a secure connection. Refer to the [Issuer API Documentation](https://github.com/in2workspace/issuer-api) for more information

## Contribution

### How to contribute
If you want to contribute to this project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Project/Component Status
This project is currently in development.

## Contact
For any inquiries or further information, feel free to reach out to us:

- **Email:** [In2 Dome Support](mailto:domesupport@in2.es)
- **Name:** IN2, Ingeniería de la Información
- **Website:** [https://in2.es](https://in2.es)

## Acknowledgments
This project is part of the IN2 strategic R&D, which has received funding from the [DOME](https://dome-marketplace.eu/) project within the European Union’s Horizon Europe Research and Innovation programme under the Grant Agreement No 101084071.
