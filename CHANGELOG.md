# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.7](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.2.7)
### Added
- Add refresh QR button

## [1.2.6](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.2.6)
### Changed
- Refactor architecture to Standalone

## [1.2.5](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.2.5)
### Fixed
- When logging out, the cache is cleared, and the session with the identity provider is terminated

## [1.2.4](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.2.4)
### Fixed
- When selecting the power "Certification" with the action "Attest", it didn't allow the credential to be created.

## [1.2.3](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.2.3)
### Added
- Added profile env variable
### Fixed
- Fix error in vc serialization from the user data

## [1.2.2](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.2.2)
### Fixed
- In credential management, fix "New create credential" button to redirect to proper route
- In credential form as a signer, show mandator form and signer panel after refreshing
- In credential form, fix validation (add length and character restrictions and error messages)
- In credential form, don't allow user to introduce 'VAT-' prefix in organization identifier field
- In credential form, don't add prefix to phone number input after submitting
- In credential form, disable already added power options and show messages when user has no added power options or has a power option without selected action
- In credential form phone input, make label go up only after clicking

## [1.2.1](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.2.1)
### Changed
- Fix several bugs

## [1.2.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.2.0)
### Changed
- The authentication logic has been changed from Role-Based Access Control (RBAC) to Policy-Based Access Control (PBAC) to enhance granularity and flexibility in permission management.
### Fixed
- The literal "Product Offer" has been replaced with "ProductOffering" in the selection of powers.

## [1.1.8](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.1.8)
### Fixed
- In credential procedures table, differentiate active sort arrow

## [1.1.7](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.1.7)
### Changed
- In credential procedures list, add limit to name column width and change title to "Full name"
- In credential procedures list, change datetime format of "updated" column
- In credential procedures list, change pagination to 10/25/50 visible objects at a time.
### Fixed
- In credential procedures table, make sort arrow always visible
- Fix credential procedures table responsiveness

## [1.1.6](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.1.6)
### Fixed
- In credential form, show error 'already added option' every time is needed
- In credential procedures list, don't log them

## [1.1.5](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.1.5)
### Fixed
- In credential form, capitalize "mobile phone" placeholder
- In credential form, sort countries dropdown alphabetically
- In credential form, make phone-prefix and country validation independent

## [1.1.4](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.1.3)
### Fixed
- Redirect to credentials list after New Credential form submit

## [1.1.3](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.1.3)
### Fixed
- Scroll to see more button
- Fav icon

## [1.1.2](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.1.2)
### Fixed
- The display name of the user logged in is now using the first name and last name of the user instead of the email

## [1.1.1](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.1.1)
### Fixed
- In credential details page, show Send reminder button only if VC status is WITHDRAWN or PEND_DOWNLOAD

## [1.1.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.1.0)
### Added 
- Sorting by status, name, and updated date in the credentials list in Backoffice 
- Requirement of at least one power in the credential creation form 
### Changed
- Issuance API contract 
- Phone number optional in credential creation form
- Changed DomePlatform power to Certification ("Upload") power 
- Button "DOCS" on Home Page now points to the Knowledge Base
- Button "LearnMore" on Home Page now points to the Knowledge Base
- "Dome" text from powers now displayed with proper capitalization
### Removed
- In home wallet section, verifier link and introductory text
### Fixed 
- In home wallet section, QR and link were not set as env variable
- Entire row in credentials list is now clickable in Backoffice 
- Display of Mandator information in credential details view 
- Removed the power combo box from the credential details view as it was unnecessary 
- Placeholder text now displayed for Mandator in credential creation form (previously showed dummy data) 
- Prevented selection of the same power more than once in credential creation form 
- Restricted issuance without a signature in the Flux module 
- Hidden signer row and buttons based on user role
- Link to wallet added on Home Page 
- QR code linking to wallet added on Home Page 

## [1.0.1](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.0.1)
### Changed
- Make sorting of credentials list case-insensitive
- Save credential api path and contract

## [1.0.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.0.0)
### Added
-Authentication configuration
-Credential Creation
-Credential Managment
-Credential Issuance

## [0.6.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v0.6.0)
### Added
- Landing Page
