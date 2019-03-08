context('Entity history', () => {

    const tabHeader = '.x-tab-panel-header ul'
    const firstTab = '.x-tab-panel-body > div:nth-child(2)'
    const secondTab = '.x-tab-panel-body > div:nth-child(3)'

    before(() => {
        cy.visit(`https://${Cypress.env('host')}/tocco`)
        cy.loginUi()
    })

    it('should fetch entity history for users', () => {
        cy.get(tabHeader).contains('Home').click()

        cy.get('.x-tool-down').click()

        cy.get('[ext\\:tree-node-id=address] + ul > li:first-child').contains('Person').click()

        // expect at least 1 person
        cy.get(`${firstTab} .x-grid3-col-numberer:first-child`).contains('1')

        // open history
        cy.get(`${firstTab} .action-group-actiongroup_info button`).click()
        cy.get('.x-menu-floating').contains('Änderungsverlauf').click()

        // expect at least 1 history entry and open it
        cy.get(`${secondTab} .x-grid3-col-numberer:first-child`).contains('1').click()

        cy.contains('Versionsdaten')
    })
})
