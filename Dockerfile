FROM cypress/browsers:node14.15.0-chrome86-ff82

WORKDIR /usr/src/app

# avoid many lines of progress bars during install
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1

COPY package.json cypress.json ./
COPY cypress ./cypress

RUN npm install
RUN $(npm bin)/cypress verify

CMD [ "npm", "run", "cy:run" ]
