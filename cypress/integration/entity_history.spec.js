context('Entity history', () => {

    const tabHeader = '.x-tab-panel-header ul'
    const firstTab = '.x-tab-panel-body > div:nth-child(2)'
    const secondTab = '.x-tab-panel-body > div:nth-child(3)'
    const thirdTab = '.x-tab-panel-body > div:nth-child(4)'

    const hasOldHistory = niceVersion => ['2.14', '2.15', '2.16', '2.17', '2.18'].includes(niceVersion)
    const isUnsupported = niceVersion => ['2.10', '2.11', '2.12', '2.13'].includes(niceVersion)

    before(() => {
        cy.visit(`https://${Cypress.env('host')}/tocco`)
        cy.loginUi()
    })

    it('should fetch entity history for users', () => {
        if (cy.window().then((win) => isUnsupported(win.Nice.version))) {
            cy.log('Skipping test, not supported in this version of Nice.')
            return
        }

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

        cy.window()
            .then((win) => {
                if (hasOldHistory(win.Nice.version)) {
                    cy.contains('Versionsdaten')
                } else {
                    // expect at least 1 snapshot entry
                    cy.get(`${thirdTab} .x-grid3-col-numberer:first-child`).contains('1')
                }
            })
    })
})
