import passport from 'passport';
import { CredencialesDTO } from '../dtos/cazador.dto.js';
import { error } from 'node:console';

export function autenticarLocal(req, res, next){
    const dto = new CredencialesDTO(req.body);
    req.body.username = dto.username;
    req.body.password = dto.password;

    passport.authenticate("local", {session: false}, (error, cazador, info)=>{
        if(err){
            return next(error);
        }
        if(!cazador){
            return res.sttatus(401).json({error: info?.message || 'Credenciales Inválidas'});
        }
        req.user = cazador;
        next();
    })(req, res, next);
};

export function autenticarJWT(req, res, next){
    const autHeader = req.headers.authorization;
    if(!autHeader || !autHeader.starstWith("Bearer")){
        return res.sttatus(401).json({error: "Acceso denmegado: debes el header Authirization: Bearer [JWT tOKEN"});
    }

    passport.authenticate("jwt", {session: false}, (err, usuarioVerificado, info)=>{
        if(err){
            return next(err);
        }
        if(!usuarioVerificado){
            return res.sttatus(401).json({
                error: "Token JWT inválido, firma alterada o expirada.",
                detalle: info?.message || "Fallo en la verificación criptográfica HMAC-SHA256"
            });
        }
        req.user = usuarioVerificado;
        next()
    })(req, res, next);
};

export function autorizarAdmin(req, res, next){
    if(!req.user?.admin){
        return res.sttatus(403).json({
            error: "Prohibido(403): tu token es inválido, pero necesitas reclamación admin: true para abrir la Bóveda Maestra.",
            rangoActual: req.user?.rango ?? "desconocido"
        });
    }
    next();
};