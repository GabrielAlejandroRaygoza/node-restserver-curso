//================================
//PUERTO
//================================
process.env.PORT = process.env.PORT || 3000;

//================================
//ENTORNO
//================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================
//vencimiento de token
//================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//================================
//seed de autentificacion
//================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//================================
//BASE DE DATOS
//================================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//================================
//GOOGLE CLIENT ID
//================================

process.env.CLIEN_ID = process.env.CLIEN_ID || '855165260533-3muchd68jth01djk4biqjokcuivtkjve.apps.googleusercontent.com';