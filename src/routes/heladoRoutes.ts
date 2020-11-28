import {Request, Response, Router } from 'express'
import { Helado, Helados, hHelado } from '../model/helados'
import { db } from '../database/database'

class HeladoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    //mostrar todos los pedidos
    private getHelados = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Helados.find({})
            console.log(query)
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        await db.desconectarBD()
    }

    //calcular el precio y los paquetes de todos los envios
    private getTpedidos =async (req: Request, res: Response) => {
        type nDoc = {
            pedido: String,
            precio: Number,
            paquetes: Number
        }
        let arrayP: Array<nDoc> = new Array<nDoc>()
        await db.conectarBD()
        let h: any 
        const query =  await Helados.find({})
        for (h of query){
           const n: any = new Helado(h._idPedido, h._sabor, h._tipo, h._cantidad, h._recibido)
            const doc: nDoc = {
                pedido: h._idPedido,
                precio: n.pPrecio() ,
                paquetes: n.nPaquetes()
            }
        arrayP.push(doc)
        console.log(`Pedido ${n._idPedido}, precio: ${n.pPrecio()} €, paquetes ${n.nPaquetes()}`)
        }
        console.log(arrayP)
        res.json(arrayP)
        await db.desconectarBD()
    }
    //calcular el precio del pedido que se busque
    private getPrecio = async (req: Request, res: Response) =>{
        const { idPedido } = req.params
        await db.conectarBD()
        .then( async () =>{
            const query: any = await Helados.findOne({_idPedido: idPedido})
            if (query == null){
                res.json({})
            }else{
                const d: any = new Helado(query._idPedido, query._sabor, query._tipo, query._cantidad, query._recibido)
                res.json({"Pedido": d._idPedido, "Precio": d.pPrecio()})
            }
        })
        await db.desconectarBD()  
    }
    //calcular los paquetes del pedido que se busque
    private getnPaquetes = async (req: Request, res: Response) => {
        const { idPedido } = req.params
        await db.conectarBD()
        .then( async () =>{
            const query: any = await Helados.findOne({_idPedido: idPedido})
            if (query == null){
                res.json({})
            }else{
                const p: any = new Helado(query._idPedido, query._sabor, query._tipo, query._cantidad, query._recibido)
                res.json({"Pedido": p._idPedido, "Paquetes": p.nPaquetes()})
            }
        })
        await db.desconectarBD()
    }
    //eliminar un pedido
    private getBorrar = async (req: Request, res: Response) => {
        const { idPedido } = req.params
        await db.conectarBD()
        await Helados.findOneAndDelete(
            {_idPedido:idPedido},
            (err: any, doc) => {
                if(err){
                    console.log(err)
                }else{
                    if(doc == null){
                        console.log('No existe el documento')
                        res.send('No existe el documento')
                    }else{
                        console.log(doc)
                        res.send('El documento ha sido borrado'+ doc)
                    }
                }
            })
        await db.desconectarBD()
    }
    //añadir un pedido con get
    private getnuevoPedido = async (req: Request, res: Response) => {
        const { idPedido, sabor, tipo, cantidad, recibido } = req.params
        console.log(req.params)
        await db.conectarBD()
        const Schema = {
            _idPedido: parseInt(idPedido),
            _sabor: sabor,
            _tipo: tipo,
            _cantidad: parseInt(cantidad),
            _recibido: recibido
        }
        const nSchema = new Helados(Schema)
        await nSchema.save()
        .then( (doc) => {
            console.log('Salvado Correctamente: '+ doc)
            res.json(doc)
        })
        .catch( (err: any) => {
            console.log(err)
            res.send(err)
        }) 
        // concatenando con cadena muestra sólo el mensaje
        await db.desconectarBD()
    }  
    //modificar pedido
    private modificar = async (req: Request, res: Response) => {
        const { idPedido } = req.params 
        const {sabor, tipo, cantidad, recibido} = req.body
        await db.conectarBD()
        const doc: any = await Helados.findOneAndUpdate(
            {_idPedido: idPedido},
            {
                _idPedido: idPedido,
                _sabor: sabor,
                _tipo: tipo,
                _cantidad: cantidad,
                _recibido: recibido
            },
            {
                new: true,
                runValidators: true
            })
            .then((doc) => {
                console.log('Documento Modificado:'+ doc)
                res.json(doc)
            })
            .catch((err) => {
                console.log(err)
                res.json({err})
            })
        await db.desconectarBD()
    }

    private crearP = async (req: Request, res: Response) => {
        const {idPedido, sabor, tipo, cantidad, recibido} = req.body
        const schema = {
            _idPedido: parseInt(idPedido),
            _sabor: sabor,
            _tipo: tipo,
            _cantidad: parseInt(cantidad),
            _recibido: recibido
        }
        const nSchema = new Helados(schema)
        await db.conectarBD()
        await nSchema.save()
        .then((doc) => {
            console.log(doc)
            res.json(doc)
        })
        .catch((err: any) => {
            console.log(err)
            res.json(err)
        })    
        await db.desconectarBD()
    }

    misRutas(){
        this._router.get('/pedidos', this.getHelados)
        this._router.get('/precios', this.getTpedidos)
        this._router.get('/precio/:idPedido', this.getPrecio)
        this._router.get('/paquete/:idPedido', this.getnPaquetes)
        this._router.get('/borrar/:idPedido', this.getBorrar)
        this._router.get('/nuevoP/:idPedido&:sabor&:tipo&:cantidad&:recibido', this.getnuevoPedido)
        this._router.post('/modificar/:idPedido', this.modificar)
        this._router.post('/nuevo', this.crearP)
    }
}

const obj = new HeladoRoutes()
obj.misRutas()
export const heladoRoutes = obj.router
