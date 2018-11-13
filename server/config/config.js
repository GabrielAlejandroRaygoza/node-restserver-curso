// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.DEV = process.env.DEV || 'dev';


// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';


// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.DEV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGODB;
}
process.env.URLDB = urlDB;


// ============================
//  Google Client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '855165260533-dnscqkaic2o62gcc8ksf1g8rkagrqjni.apps.googleusercontent.com';