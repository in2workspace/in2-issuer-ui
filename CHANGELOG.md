# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## - unreleased
### Fixed
- In power component, show only Certification, OnBoarding and ProductOffering functions

### Removed
- In home wallet section, verifier link and introductory text

### Fixed
- In home wallet section, QR and link were not set as env variable


## [1.0.1] - 2024-09-09

### Changed
- Make sorting of credentials list case-insensitive

## [1.1.0] - 2024-09-26
### Changed 
- Issuance API contract 
- Phone number optional in credential creation form
- Changed DomePlatform power to Certification ("Upload") power 
- Button "DOCS" on Home Page now points to the Knowledge Base
- Button "LearnMore" on Home Page now points to the Knowledge Base
- "Dome" text from powers now displayed with proper capitalization 
### Added 
- Sorting by status, name, and updated date in the credentials list in Backoffice 
- Requirement of at least one power in the credential creation form 
### Fixed 
- Entire row in credentials list is now clickable in Backoffice 
- Display of Mandator information in credential details view 
- Removed the power combo box from the credential details view as it was unnecessary 
- Placeholder text now displayed for Mandator in credential creation form (previously showed dummy data) 
- Prevented selection of the same power more than once in credential creation form 
- Restricted issuance without a signature in the Flux module 
- Hidden signer row and buttons based on user role
- Link to wallet added on Home Page 
- QR code linking to wallet added on Home Page 

## [1.0.1] - 2024-09-09

### Updated
- Save credential api path and contract


## [1.0.0] - 2024-06-21
### Added
-Authentication configuration
-Credential Creation
-Credential Managment
-Credential Issuance

## [0.6.0] - 2024-05-23
### Added
- Landing Page
