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
docker build -t test-after-depl .
```

Run the tests:
```
docker run \
 -e "cypress_host=${NICE_INSTALLATION_HOST}" \
 -e "cypress_username=${USERNAME}" \
 -e "cypress_password=${PASSWORD}" \
 test-after-depl
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

## Prerequisites and assumptions
* The `person` module has to be the first module in the `address` module group
* The reports `Geburtstagsliste` and `Mitarbeiterverzeichnis` report have to be available
* The configured login must exist on the configured installation
* The interface language of the login must be german
* The login requires the role `userguest` (**only** this role) to be allowed to test the functionality described above
* There must exist a User entity called "Tocco AG, Support" (firstname "Support", lastname "Tocco AG")

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
