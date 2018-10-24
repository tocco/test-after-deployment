context('Website', () => {

    it('should reach the website', () => {
        if (Cypress.env('website')) {
            cy.request(`${Cypress.env('website')}?ts=${new Date().getTime()}`).then((response) => {
                expect(response.status).to.eq(200)
            })
        } else {
            cy.log('Skipping test, environment variable `website` is not set.')
        }
    })
})
