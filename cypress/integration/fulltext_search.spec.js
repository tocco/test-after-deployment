context('Fulltext search', () => {

    before(() => {
        cy.visit(`https://${Cypress.env('host')}/tocco`)
        cy.loginUi()
    })

    it('should find Tocco person in fulltext search field', () => {
        cy.get('.admin-header input[type=text].full-find').type('Tocco AG Support')

        cy.get('.x-combo-list .search-item', {
            timeout: 120000 // it can take quite some time until the search results appear
        }).contains('Tocco AG, Support').click()

        // form values
        cy.get('.firstname-value').contains('Support')
        cy.get('.lastname-value').contains('Tocco AG')

        // default display in open panel
        cy.get('#openPanel_1').contains('Tocco AG, Support')
    })
})
