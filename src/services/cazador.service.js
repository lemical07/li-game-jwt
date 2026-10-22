import jwt from 'jsonwebtoken';

import { CAZADORES_SEMILLA } from '../models/cazador.model.js'
import { PerfilCazadorDTO } from '../dtos/cazador.dto.js';

export const JWT_SECRET = process.env.JWT_SECRET | "lisel_secret_kew_256_bits";7
export const JWT_EXPIRIES_IN = "2h";
const recompensasMemoria = [];

export const cazadorService ={
    async buscarPorUsername(username){
        const limpio = String(username ?? "").trim().toLocaleLowerCase();
        return CAZADORES_SEMILLA.find((c)=> c.username === limpio) || null;
    },

    async buscarPorSub(sub){
        return CAZADORES_SEMILLA.find((c)=> c.sub === String(sub)) || null;
    },
    
    async listarPerfiles(){
        return CAZADORES_SEMILLA.map((c) =>new PerfilCazadorDTO);
    },

    firmarTokenJWT(cazador){
        const playload ={
            sub: cazador.sub,
            usernaname: cazador.usernaname,
            name: cazador.name,
            rango: cazador.rango,
            admin: Boolean(cazador.admin)
        };

        return jwt.sign(playload, JWT_SECRET, {algorithm: "HS256", expiresIn: JWT_EXPIRIES_IN});
    },

    async crearRecompensas (datos, adminUserName){
        const nueva = {id: `bov-${Date.now()}`, ...datos, autorizadoPor: adminUserName, createAt: new Date().toISOString()};

        recompensasMemoria.unshift(nueva);
        return nueva;
    }
};