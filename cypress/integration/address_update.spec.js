const dateToday = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0' + today.getDate()).slice(-2)
    return `${day}.${month}.${year}`
}

context('Address Update Flow', () => {

    it('should update the date of birth', () => {
        if (Cypress.env('website')) {
            const url = `${Cypress.env('website')}/Test/Address-Update-(Cypress)`

            cy.request({
                url,
                failOnStatusCode: false
            }).then(response => {
                if (response.status === 200 || response.status === 401) {
                    cy.visit(url, {
                        failOnStatusCode: false
                    })

                    cy.loginUi()

                    cy.get('.x-form-display-field.firstname-value').contains('Support')
                    cy.get('.x-form-display-field.lastname-value').contains('Tocco AG')
                    cy.get('.AddressUpdate button').contains('Bearbeiten').click()

                    cy.get('.birthdate-item .x-form-date-trigger').click()
                    cy.get('.x-date-picker .x-date-bottom button').contains('Heute').click()

                    // toggle checkbox to make sure the form date is changed and the data can be saved
                    cy.get('.publish_detail-item input[type=checkbox]').click()

                    cy.get('.x-panel-footer').contains('Speichern').click()

                    cy.get('div.birthdate-value').contains(dateToday())
                } else {
                    cy.log(`Skipping test, page ${url} not found.`)
                }
            })
        } else {
            cy.log('Skipping test, environment variable `website` is not set.')
        }
    })
})
