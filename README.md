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

## Architecture
The application is based on the following architecture:
### Issuer UI 

## Main Features
// TODO: Add the main features of the application
·Landing Page

# Getting Started
This aplication is developed, builded and tested in Visual Studio Code 
1. Clone the repository:
```git clone https://github.com/in2workspace/issuer-ui.git```
2. Install dependencies:
```npm install```
1. Start aplication in local development
```npm start```
1. Build docker image
```docker build -t issuer-ui .```
1. Run docker image
```docker run -p 4200:8088 -e login_url=http://yourdomain.com -e wallet_url=http://yourdomain.com issuer-ui```
# Customization



# Build and Test
We have 3 different ways to build and test the project depending on the selected Spring Boot profile.
- `test` profile: This profile is used for unit testing. It uses an in-memory database and does not require any external dependencies.
- `local` profile: This profile is used for local development. It uses an in-memory database and generates default data to test the application. You need to run a set of docker containers to run the application (Orion Context Broker and MongoDb).
- `local-docker` profile: This profile is used for local development. It uses a dockerized database and generates default data to test the application.
- `dev` profile: This profile is used for development. It uses a dockerized database and generates default data to test the application.
- `docker` you can set environment variables dinamicaly using '-e WCA_URL=http://yourdomain.com' all the diferent environment variables are WCA_URL, DATA_URL, LOGIN_URL, REGISTER_URL, EXECCONT_URI, VP_URL, CRED_URI, CREDID_URI, USER_URI
# Contribute

# License

# Documentation
