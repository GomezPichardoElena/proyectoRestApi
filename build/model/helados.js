"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helados = exports.heladosSchema = exports.Helado = void 0;
const mongoose_1 = require("mongoose");
class Helado {
    constructor(id, sabor, tipo, cantidad, recibido) {
        this._idPedido = id;
        this._sabor = sabor;
        this._tipo = tipo;
        this._cantidad = cantidad;
        this._recibido = false;
    }
    get id() {
        return this._idPedido;
    }
    get sabor() {
        return this._sabor;
    }
    get tipo() {
        return this._tipo;
    }
    get cantidad() {
        return this._cantidad;
    }
    get recibido() {
        return this._recibido;
    }
    set cantidad(cantidad) {
        if (cantidad <= 0) {
            throw "El mínimo de paquetes a enviar es 1";
        }
        this._cantidad = cantidad;
    }
    set sabor(sabor) {
        this._sabor = sabor;
    }
    set tipo(tipo) {
        this._tipo = tipo;
    }
    set recibido(recibido) {
        this._recibido = recibido;
    }
    nPaquetes() {
        let paquetes = 4; //en 1 paquete caben 4 cajas 
        let total = 0;
        if (isNaN(this._cantidad)) {
            throw "No has introducido una cantidad";
        }
        else {
            if (this._cantidad <= paquetes) {
                return total = 1;
            }
            else {
                return total = this._cantidad / paquetes;
            }
        }
    }
    pPrecio() {
        let peso;
        let precio;
        if (isNaN(this._cantidad)) {
            throw "No has introducido una cantidad";
        }
        else {
            if (this._tipo == "polos") {
                peso = this._cantidad * 300;
                return precio = (peso / 1000) * 2, 40 * 4;
            }
            else {
                if (this._tipo == "cucuruchos") {
                    peso = this._cantidad * 400;
                    return precio = (peso / 1000) * 2 * 5;
                }
                else {
                    if (this._tipo == "tarrinas") {
                        peso = this._cantidad * 500;
                        return precio = (peso / 1000) * 3 * 3;
                    }
                    else {
                        throw "Tipo de helado incorrecto";
                    }
                }
            }
        }
    }
}
exports.Helado = Helado;
exports.heladosSchema = new mongoose_1.Schema({
    _idPedido: {
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
});
exports.Helados = mongoose_1.model('helados', exports.heladosSchema);
