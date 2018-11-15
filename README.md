# After Deployment Health Check

After each deployment we want to check if the basic functions still work like they're supposed to.

This repository contains an automated Cypress test which checks those functions for us.

## Getting started

Make sure, *yarn* is installed (https://yarnpkg.com/en/docs/install) and run the following command:

```
yarn install
```

Next create a file called `cypress.env.json` in the root directory with the following environment variables (replace
**${...}** with your actual values):

```
{
  "host": "${NICE_INSTALLATION_HOST}", (e.g. "master.tocco.ch")
  "username": "${USERNAME}", (e.g. "tocco")
  "password": "${PASSWORD}" (password for the user declared in username variable)
  "website": "${WEBSITE}" (URL for the website to check for availability and for the of the address update flow; optional)
}
```

Now run the tests:

```
yarn run cy:run
```

### Development mode

During development, you may want to keep Cypress open and don't just run all the tests:

```
yarn run cy:open
```

### Docker

You can create a docker image to run the test in the CI server.

Build the image:
```
docker build -t test-after-deployment .
```

Run the tests:
```
docker run \
 -e "cypress_host=${NICE_INSTALLATION_HOST}" \
 -e "cypress_username=${USERNAME}" \
 -e "cypress_password=${PASSWORD}" \
 -e "cypress_website=${WEBSITE}" \
 test-after-deployment
```

## Tested application functions:
* Login
* Fulltext search
  * Search for "Tocco AG Support" in fulltext search field in header bar
  * Open item that contains "Tocco AG, Support" (should be a User)
  * Check if User form loads with "Support" as firstname and "Tocco AG" as lastname
  * Check if default display in panel with open entities is "Tocco AG, Support"
* Reports
  * Open `person` module (first module under `address` module group)
  * Check if there's some data (wait for first record to appear)
  * Generate `Geburtstagsliste` report (Freemarker) for the first record
  * Generate `Mitarbeiterverzeichnis` report (Jasper) for the first record
* Website availability
  * Request the website and check if response status is `200`
* Address update flow
  * Open flow on page `/Test/Address-Update-(Cypress)`
  * Check if firstname on readonly page is "Support" and lastname is "Tocco AG"
  * Click on edit button
  * Set date of birth to today
  * Toggle "publication" checkbox to make sure the form is actually changed
    and the data can be saved (maybe the date of birth was already the current
    date before -> submit button wouldn't get enabled in this case)
  * Click save button
  * Check if date of birth on readonly page is today

## Prerequisites and assumptions
* The `person` module has to be the first module in the `address` module group
* The reports `Geburtstagsliste` and `Mitarbeiterverzeichnis` report have to be available
* The configured login must exist on the configured installation
* The interface language of the login must be german
* The login requires the role `userguest` (**only** this role) to be allowed to test the functionality described above
* There must exist a User entity called "Tocco AG, Support" (firstname "Support", lastname "Tocco AG") and the login
  we use must belong to this User
* Recommended CMS setup for Address update flow test (Address update flow must be available on the URL
  `/Test/Address-Update-(Cypress)` for the flow test):
  * Create a new `content` login role called `Cypress-Test`
  * Assign this role to the cypress test login and to the `tocco` login
  * Create a new page called `Test` on the root level of the website domain
    * Publish status: offline
    * Visible in navigation: no
    * Set read permissions so that only the `Cypress-Test` role can read the page
    * Create a new page called `Address-Update-(Cypress)` below this page
      * Visible in navigation: no
      * Set the same read permissions as on the `Test` page (should already be the case if you set the
        permissions on the `Test` page before you created this page)
      * Insert the widget `Address update` in this page
      * **Publish the page `Address-Update-(Cypress)`**
    

## Known issues

### Session cookies not cleared properly

Sometimes when the tests are run, we're already logged in. That's why we check in the test whether the `nice_auth`
cookie is set and simply assume that we're already logged in in this case. A different strategy would be to log out
first - but for some reason, this didn't work either.

See related Cypress issues:
* Cypress doesn't always clean up cookies (https://github.com/cypress-io/cypress/issues/781)
* Cypress crash: Error: Failed to parse or set cookie named (https://github.com/cypress-io/cypress/issues/1321)

### Tests run indefinitely with electron browser

By default, Cypress uses the Electron browser in headless mode to run the tests. For some reason, the tests run
indefinitely if this browser is used with `yarn run cy:run`. Therefore, we use Chrome instead of Electron as a
workaround. Unfortunately, there are some downsides: the tests don't run headless now, no video can be recorded.

See related Cypress issues:
* Hangs indefinitely while running tests (https://github.com/cypress-io/cypress/issues/1235)
* cypress run doesn't return to command line (https://github.com/cypress-io/cypress/issues/815)
