import { mount } from 'cypress/react18';
import { ThankYouPage } from '../../src/components/ThankYouPage';

describe('ThankYouPage', () => {
  it('displays the purchase confirmation and order number', () => {
    mount(<ThankYouPage orderNumber="ABC12345" onBackToStore={() => {}} />);

    cy.contains('h1', 'Thank You for Your Purchase!').should('be.visible');
    cy.contains(
      "Your order has been successfully placed. We've sent a confirmation email with your order details."
    ).should('be.visible');
    cy.contains('Order Number').should('be.visible');
    cy.contains('ABC12345').should('be.visible');
    cy.contains('button', 'Back to Store').should('be.visible');
  });

  it('calls onBackToStore when the user clicks Back to Store', () => {
    const onBackToStore = cy.stub().as('onBackToStore');

    mount(<ThankYouPage orderNumber="ABC12345" onBackToStore={onBackToStore} />);

    cy.contains('button', 'Back to Store').click();
    cy.get('@onBackToStore').should('have.been.calledOnce');
  });
});