# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.13.2](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.13.2)
### Added
- Implementation of configure signature.

## [1.12.2](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.12.2)
### Fixed
- Changed default wallet URLs to ".eu"

## [1.12.1](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.12.1)
### Fixed
- Fixed error dialog messages for credential offer stepper.


## [1.12.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.12.0)
### Changed
- Adapt details page to 3 credential types (LEARCredentialEmployee, LEARCredentialMachine and VerifiableCertification)
- Add "basic information" in details page (credential type, validity, valid-from, valid-until)
- Change route to create procedure as signer from "create2/admin" to "create-as-signer"

## [1.11.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.11.0)
### Changed
- Refactored and renamed some environment variables
- Renamed some directories and files
- Moved some environment variables to application constants to remove unnecessary complexity
### Added
- Added some minor fixes

## [1.10.3](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.10.3)
### Modify
- Change CREDENTIAL_OFFER_URI env name to CREDENTIAL_OFFER_URL.

## [1.10.2](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.10.2)
### Fixed
- Fix error to handle email failure.

## [1.10.1](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.10.1)
### Fixed
- Fix error during credential detail visualization

## [1.10.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.10.0)
### Added
- Added button to sign credential when sync flux fails
### Fixed
- Small fixes

## [1.9.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.9.0)
### Added
- Access by role and policies.

## [1.8.2](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.8.2)
### Added
- Solution to spelling error.

## [1.8.1](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.8.1)
### Added
- Display credential issuer information in the credential detail view.

## [1.8.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.8.0)
### Added
- Compatibility with LEARCredential V2

## [1.7.1](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.7.1)
### Added
- When leaving credential offer stepper (after clicking "Leave" on refresh popup) and being redirected to home, show warning popup.
- Environment variable for knowledge wallet.
### Changed
- In Mandator, remove placeholders
- Restructuring the navbar.
### Fixed
- After logout, if the user tries to access the dashboard again, it redirects them back to the login.

## [1.7.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.7.0)
### Added
- Updating to Angular 18 and dependencies.
- Change in the navbar, with dropdown logout and settings.
- Creation of configuration component and policy verification.

## [1.6.3](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.6.3)
### Fixed
- In credential issuance form, after clicking on remove power icon, don't remove power if user clicks "Cancel"

### Changed
- In credential issuance form, remove back arrow
- In details page, make back arrow bigger
- In credential offer Step 1, center 

## [1.6.2](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.6.2)
### Fixed
- In credential offer stepper, when clicking refresh button, close popup and don't leave while it's refreshing

## [1.6.1](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.6.1)
### Added
- Added customized colors for navbar and logo.

## [1.5.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.5.0)
### Added
- Search bar in credentials dashboard
- Success popup after creating credential and after sending reminder
- In credential offer step 2, added popup to refresh offer when it is about to expire. If not refreshed, redirects to the home page.
- In details and credential issuance pages, "Back" button

### Changed
- In credentials dashboard, changed order of columns and added color to status indicators
- Send Reminder button is positioned at the bottom of the details page
- In navbar, organization name appears below the username
- Updated button styles in dashboard, form and stepper

## [1.4.3](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.4.3)
### Fixed
- Translations are applied to all components

## [1.4.2](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.4.2)
### Fixed
- In non-PRD environments, in the first step of the stepper, show a link to access the same-environment Wallet

## [1.4.1](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.4.1)
### Added
- Test Wallet url for getting credential offer through same-device flow in the same environment

## [1.4.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.4.0)
### Added
- Same-device flow: user can get credential with a signel device, without need to scan QR
- Stepper to get credential offer

## [1.3.0](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.3.0)
### Changed
- Add new attribute to the credentials view
- Disable the credential view for unknown credentials type

## [1.2.7](https://github.com/in2workspace/in2-issuer-ui/releases/tag/v1.2.7)
### Added
- User is now redirected after send reminder
- A dialog with spinner appears while waiting for server response

### Changed
- Floating elements are unified, there is only dialogs with confirm and error styles.
- Unified styles (Blinker font, primary color)

### Fixed
- Sort arrow and header style corresponds to relative column state (sorting or not sorting)


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
