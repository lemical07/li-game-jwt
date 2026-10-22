import { Schema, model } from 'mongoose';
import { timeStamp } from 'node:console';
import { type } from 'node:os';

const cazadorSchema = new Schema({
    sub:      {type: String, require: true, unique: true},
    username: {type: String, require: true, unique: true, lowercase: true, trim: true},
    name:     {type: String, require: true, trim: true},
    rango:    {type: String, enum: ["S", "A", "B", "C"], default: "B"},
    admin:    {type: Boolean, versionKey: false}
}, {timeStamp: true, versionKey: false});

export const cazador = model("Cazador", cazadorSchema);

export const CAZADORES_SEMILLA = [
    {id: "1234567890", sub: "1234567890", username: "satinder", password: "12345", name: "Satinder Cyborg", rango: "S", admin: true },
    {id: "9876543210", sub: "9876543210", username: "kael", password: "54321", name: "Kael Vanguard", rango: "A", admin: false },
    { d: "5556667770", sub: "5556667770", username: "nyx", password: "99999", name: "Nyx Shadowrunner", rango: "A", admin: false },
];