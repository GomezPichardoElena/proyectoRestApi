import{Schema, model} from 'mongoose'

export class Helado{
    private _idPedido: number
    private _sabor: string
    private _tipo: string
    private _cantidad: number
    private _recibido: boolean 

    constructor(id: number, sabor:string, tipo:string, cantidad: number, recibido: boolean){
        this._idPedido = id
        this._sabor = sabor
        this._tipo = tipo
        this._cantidad = cantidad
        this._recibido = false
    }

get id(){
    return this._idPedido
}

get sabor(){
    return this._sabor
}

get tipo(){
    return this._tipo
}

get cantidad(){
    return this._cantidad
}

get recibido(){
    return this._recibido
}

set cantidad(cantidad: number){
        if(cantidad <=0){
            throw "El mínimo de paquetes a enviar es 1"
        }
    this._cantidad=cantidad
}

set sabor(sabor: string){
    this._sabor=sabor
}

set tipo(tipo: string){
    this._tipo=tipo
}

set recibido(recibido: boolean){
        this._recibido=recibido
}

nPaquetes(){
    let paquetes = 4 //en 1 paquete caben 4 cajas 
    let total = 0
    if(isNaN(this._cantidad)){
        throw "No has introducido una cantidad"
    }else{
        if(this._cantidad <= paquetes){
            return total = 1
        }else{
            return total = this._cantidad/paquetes
        }
    }
}

pPrecio(){
    let peso:number
    let precio:number
    if(isNaN(this._cantidad)){
        throw "No has introducido una cantidad"
    }else{
        if(this._tipo=="polos"){
            peso = this._cantidad*300
            return precio = (peso/1000)*2,40*4
        }else{
            if(this._tipo=="cucuruchos"){
                peso = this._cantidad*400
                return precio = (peso/1000)*2*5
            }else{
                if(this._tipo=="tarrinas"){
                    peso = this._cantidad*500
                    return precio = (peso/1000)*3*3
                }else{
                    throw "Tipo de helado incorrecto"
                }
            }
        }
    }
}}

export type hHelado = {
    _idPedido: number,
    _sabor: string,
    _tipo: string,
    _cantidad: number,
    _recibido: Boolean
}

export const heladosSchema = new Schema({
    _idPedido:{
        type: Number,
        unique: true
    },
    _sabor: String,
    _tipo: String,
    _cantidad: {
        type: Number,
        max: 20
    },
    _recibido: Boolean
})

export const Helados = model('helados', heladosSchema)