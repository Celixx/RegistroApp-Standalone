describe('verificar mi aplicación', () => {
    
    it('Verificar login con credenciales incorrectas', () => {
        cy.visit('http://localhost:8100/').then(() => {
            cy.get('#correo').invoke('val', 'correoincorrecto@duocuc.cl');
            cy.get('#password').invoke('val', 'contrasenaincorrecta');
            cy.contains('Ingresar').click();
            cy.get('#label').should('contain.text', 'Inicia de sesión con tus credenciales institucionales')
            
        })
    })

    it('Verificar login con credenciales correctas', () => {
        cy.visit('http://localhost:8100/').then(() => {
            cy.get('#correo').invoke('val', 'atorres@duocuc.cl');
            cy.wait(1000);
            cy.get('#password').invoke('val', '1234');
            cy.wait(1000);
            cy.contains('Ingresar').click();
            cy.intercept('/home/qr').as('route').then(() => {
                cy.get('ion-card-title').should('contain.text', 'Sistema de Asistencia Duoc');
                cy.get('#saludo').should('contain.text', 'Bienvenido Ana')
                cy.get('#salir').click
            });
        })
    })

});