// https://docs.cypress.io/api/introduction/api.html

describe("frontend-e2e", () => {
	it("visits the app root url", () => {
		cy.visit("/");
		cy.contains("h1", "Frontend Demo");
	});
});
