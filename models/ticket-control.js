const  path = require('path');
const fs = require('fs');

class Ticket{
    constructor(numero, escritorio){
        this.numero = numero
        this.escritorio = escritorio
    }
}


class TicketControl {

    //Inicializamos nuestra bd

    constructor(){
        this.ultimo = 0 //Ultimo ticket
        this.hoy = new Date().getDate();
        this.tickets = [] //Tickets pendientes
        this.ultimos4 = [] //Ultimos 4 tickets, los que se muestran en pantalla

        this.init();
    }

    get toJson(){
        return { 
        ultimo:this.ultimo,
        hoy:this.hoy,
        tickets:this.tickets,
        ultimos4:this.ultimos4
        }
    }

//Leemos el archivo de db y establecemos las propiedades
    init(){
        const {hoy,ultimo,ultimos4,tickets} = require('./../db/data.json')

        if(hoy === this.hoy){
            this.tickets = tickets; 
            this.ultimo = ultimo; 
            this.ultimos4 = ultimos4; 
        }else{
            this.guardarDB()
        }
    }

    guardarDB(){
        const dbPath = path.join(__dirname,'../db/data.json')
        fs.writeFileSync(dbPath,JSON.stringify(this.toJson))
    }

    siguiente(){
        this.ultimo +=1; 
        const ticket = new Ticket(this.ultimo, null)
        this.tickets.push(ticket)

        this.guardarDB();

        return 'ticket' + ticket.numero;
    }

    atenderTicktet(escritorio){
        if(this.tickets.length === 0 ){
            return null;
        }

        const ticket = this.tickets.shift()
        ticket.escritorio = escritorio;
    
        this.ultimos4.unshift(ticket)
    
        if(this.ultimos4.length > 4){
            this.ultimos4.splice(-1,1)
        }
        this.guardarDB();

        return ticket
    }

}


module.exports = TicketControl;