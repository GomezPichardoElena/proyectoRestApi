"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.heladoRoutes = void 0;
const express_1 = require("express");
const helados_1 = require("../model/helados");
const database_1 = require("../database/database");
class HeladoRoutes {
    constructor() {
        //mostrar todos los pedidos
        this.getHelados = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield helados_1.Helados.find({});
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        //calcular el precio y los paquetes de todos los envios
        this.getTpedidos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let arrayP = new Array();
            yield database_1.db.conectarBD();
            let h;
            const query = yield helados_1.Helados.find({});
            for (h of query) {
                const n = new helados_1.Helado(h._idPedido, h._sabor, h._tipo, h._cantidad, h._recibido);
                const doc = {
                    pedido: h._idPedido,
                    precio: n.pPrecio(),
                    paquetes: n.nPaquetes()
                };
                arrayP.push(doc);
                console.log(`Pedido ${n._idPedido}, precio: ${n.pPrecio()} €, paquetes ${n.nPaquetes()}`);
            }
            console.log(arrayP);
            res.json(arrayP);
            yield database_1.db.desconectarBD();
        });
        //calcular el precio del pedido que se busque
        this.getPrecio = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idPedido } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield helados_1.Helados.findOne({ _idPedido: idPedido });
                if (query == null) {
                    res.json({});
                }
                else {
                    const d = new helados_1.Helado(query._idPedido, query._sabor, query._tipo, query._cantidad, query._recibido);
                    res.json({ "Pedido": d._idPedido, "Precio": d.pPrecio() });
                }
            }));
            yield database_1.db.desconectarBD();
        });
        //calcular los paquetes del pedido que se busque
        this.getnPaquetes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idPedido } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield helados_1.Helados.findOne({ _idPedido: idPedido });
                if (query == null) {
                    res.json({});
                }
                else {
                    const p = new helados_1.Helado(query._idPedido, query._sabor, query._tipo, query._cantidad, query._recibido);
                    res.json({ "Pedido": p._idPedido, "Paquetes": p.nPaquetes() });
                }
            }));
            yield database_1.db.desconectarBD();
        });
        //eliminar un pedido
        this.getBorrar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idPedido } = req.params;
            yield database_1.db.conectarBD();
            yield helados_1.Helados.findOneAndDelete({ _idPedido: idPedido }, (err, doc) => {
                if (err) {
                    console.log(err);
                }
                else {
                    if (doc == null) {
                        console.log('No existe el documento');
                        res.send('No existe el documento');
                    }
                    else {
                        console.log(doc);
                        res.send('El documento ha sido borrado' + doc);
                    }
                }
            });
            yield database_1.db.desconectarBD();
        });
        //añadir un pedido con get
        this.getnuevoPedido = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idPedido, sabor, tipo, cantidad, recibido } = req.params;
            console.log(req.params);
            yield database_1.db.conectarBD();
            const Schema = {
                _idPedido: parseInt(idPedido),
                _sabor: sabor,
                _tipo: tipo,
                _cantidad: parseInt(cantidad),
                _recibido: recibido
            };
            const nSchema = new helados_1.Helados(Schema);
            yield nSchema.save()
                .then((doc) => {
                console.log('Salvado Correctamente: ' + doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log(err);
                res.send(err);
            });
            // concatenando con cadena muestra sólo el mensaje
            yield database_1.db.desconectarBD();
        });
        //modificar pedido
        this.modificar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idPedido } = req.params;
            const { sabor, tipo, cantidad, recibido } = req.body;
            yield database_1.db.conectarBD();
            const doc = yield helados_1.Helados.findOneAndUpdate({ _idPedido: idPedido }, {
                _idPedido: idPedido,
                _sabor: sabor,
                _tipo: tipo,
                _cantidad: cantidad,
                _recibido: recibido
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => {
                console.log('Documento Modificado:' + doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log(err);
                res.json({ err });
            });
            yield database_1.db.desconectarBD();
        });
        this.crearP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idPedido, sabor, tipo, cantidad, recibido } = req.body;
            const schema = {
                _idPedido: parseInt(idPedido),
                _sabor: sabor,
                _tipo: tipo,
                _cantidad: parseInt(cantidad),
                _recibido: recibido
            };
            const nSchema = new helados_1.Helados(schema);
            yield database_1.db.conectarBD();
            yield nSchema.save()
                .then((doc) => {
                console.log(doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log(err);
                res.json(err);
            });
            yield database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/pedidos', this.getHelados);
        this._router.get('/precios', this.getTpedidos);
        this._router.get('/precio/:idPedido', this.getPrecio);
        this._router.get('/paquete/:idPedido', this.getnPaquetes);
        this._router.get('/borrar/:idPedido', this.getBorrar);
        this._router.get('/nuevoP/:idPedido&:sabor&:tipo&:cantidad&:recibido', this.getnuevoPedido);
        this._router.post('/modificar/:idPedido', this.modificar);
        this._router.post('/nuevo', this.crearP);
    }
}
const obj = new HeladoRoutes();
obj.misRutas();
exports.heladoRoutes = obj.router;
