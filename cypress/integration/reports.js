context('Reports', () => {

    const tabHeader = '.x-tab-panel-header ul'
    const firstTab = '.x-tab-panel-body > div:nth-child(2)'

    before(() => {
        cy.visit(`https://${Cypress.env('host')}/tocco`)
        cy.loginUi()
    })

    const generatePersonReport = report => {
        cy.get(tabHeader).contains('Home').click()

        cy.get('.x-tool-down').click()

        cy.get('[ext\\:tree-node-id=address] + ul > li:first-child').contains('Person').click()

        cy.get(`${firstTab} .x-grid3-col-numberer:first-child`).contains('1')

        cy.get(`${firstTab} .x-grid3-row-checker`).first().click()

        cy.contains('Ausgabe').click()

        cy.get('.x-menu-floating').contains(report).click()

        cy.contains('Generieren (1)').click()

        cy.get('div.relOutput_job_type-value').contains('Manuell')

        cy.get(tabHeader).contains('Home').trigger('contextmenu')
        cy.get('.x-menu-floating').contains('Alle Reiter schliessen').click()
    }

    it('should generate Geburtstagsliste report (Freemarker) for first person', () => {
        generatePersonReport('Geburtstagsliste')
    })

    it('should generate Mitarbeiterverzeichnis report (Jasper) for first person', () => {
        generatePersonReport('Mitarbeiterverzeichnis')
    })
})
