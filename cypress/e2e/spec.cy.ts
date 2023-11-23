import { waitForAsync } from "@angular/core/testing";

describe('verificar mi aplicación', () => {
    
    it('Verificar login con credenciales incorrectas', () => {
        cy.visit('http://localhost:8100/').then(() => {
            cy.get('#correo').invoke('val', '');
            cy.get('#correo').type('correoincorrecto@duocuc.cl');
            cy.get('#password').invoke('val', '');
            cy.get('#password').type('contraseñaincorrecta');
            cy.contains('Ingresar').click();
            cy.get('#label').should('contain.text', 'Inicia de sesión con tus credenciales institucionales')
            
        })
    })

    it('Verificar login con credenciales correctas', () => {
        cy.visit('http://localhost:8100').then(() => {
            cy.get('#correo').invoke('val', '');
            cy.get('#correo').type('atorres@duocuc.cl');
            cy.get('#password').invoke('val', '');
            cy.get('#password').type('1234');
            cy.contains('Ingresar').click();
            cy.intercept('/home/qr').as('route').then(() => {
                cy.get('#saludo').should('contain.text', 'Bienvenido Ana')
            });
        })
    })

    it('Hacer y eliminar un post en foro', () => {
        cy.visit('http://localhost:8100/home/foro').then(() => {
            cy.wait(1000);
            cy.contains('Publicador').click({force: true});
            cy.wait(500);
            cy.get('ion-alert').within(() => {                     
                cy.contains('Leanne Graham').click();
                cy.wait(500);
                cy.contains('OK').click();
              });
            cy.wait(500);
            cy.get('#inputTitulo').invoke('val', '');
            cy.get('#inputTitulo').type('Publicacion de Prueba');
            cy.get('#inputCuerpo').invoke('val', '');
            cy.get('#inputCuerpo').type('Cuerpo');
            cy.contains('Publicar').click();
            cy.wait(500);
            cy.contains('Eliminar').click({force: true});
            cy.wait(500);
            cy.contains('Publicacion de Prueba').should('not.exist');
         }) 
    })


    it('Modificar info mis datos', () => {
        cy.visit('http://localhost:8100/home/mis-datos').then(() => {
            cy.wait(1000); 
            cy.get('#inputNombre').invoke('val', '');
            cy.get('#inputNombre').type('Ana');
            cy.get('#inputApellido').invoke('val', '');
            cy.get('#inputApellido').type('Torres');
            cy.get('#inputCorreo').invoke('val', '');
            cy.get('#inputCorreo').type('atorres@duocuc.cl');
            cy.get('#inputPregunta').invoke('val', '');
            cy.get('#inputPregunta').type('Nombre de mi mascota');
            cy.get('#inputRespuesta').invoke('val', '');
            cy.get('#inputRespuesta').type('gato');
            cy.get('#inputContraseña').invoke('val', '');
            cy.get('#inputContraseña').type('1234');
            cy.get('#inputRepetir').invoke('val', '');
            cy.get('#inputRepetir').type('1234');
            cy.get('#inputNombre').invoke('val', '');
            cy.contains('Guardar').click();
            cy.contains('Salir').click();
        });
    })

    it('Revisar info modificada', () => {
        cy.visit('http://localhost:8100').then(() => {
            cy.get('#correo').invoke('val', '');
            cy.get('#correo').type('atorres@duocuc.cl');
            cy.get('#password').invoke('val', '');
            cy.get('#password').type('1234');
            cy.contains('Ingresar').click();
            cy.visit('http://localhost:8100/home/mis-datos').then(() => {
                cy.wait(500);
                cy.get('#inputNombre').should('have.value', 'Ana')
                cy.get('#inputApellido').should('have.value', 'Torres')
                cy.get('#inputCorreo').should('have.value', 'atorres@duocuc.cl')
                cy.get('#inputPregunta').should('have.value', 'Nombre de mi mascota')
                cy.get('#inputRespuesta').should('have.value', 'gato')
                cy.get('#inputContraseña').should('have.value', '1234')
            })
        })
    })
});