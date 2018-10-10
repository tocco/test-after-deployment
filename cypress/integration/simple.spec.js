context('Test', () => {

    const firstTab = '.x-tab-panel-body > div:nth-child(2)'

    before(() => {
        cy.visit(`https://${Cypress.env('host')}/tocco`)
    })

    const login = () => {
        cy.get('input[name=user]').type(Cypress.env('username'))
        cy.get('input[name=password]').type(Cypress.env('password'), {
            log: false
        })
        cy.get('button[type=submit]').click()
    }

    const runTest = () => {
        cy.get('.x-tool-down').click()

        cy.get('[ext\\:tree-node-id=address] + ul > li:first-child').contains('Person').click()

        cy.get(`${firstTab} .x-grid3-col-numberer:first-child`).contains('1')

        cy.get(`${firstTab} .x-grid3-row-checker`).first().click()

        cy.contains('Ausgabe').click()

        cy.get('.x-menu-floating > ul > li:first-child').contains('Telefonliste').click()

        cy.contains('Generieren (1)').click()

        cy.get('div.relOutput_job_type-value').contains('Manuell')
    }

    it('should generate Telefonliste report for first person', () => {
        cy.getCookie('nice_auth').then(cookie => {
            if (!cookie) {
                login()
            }
            runTest()
        })
    })
})
