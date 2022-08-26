const http = require('http'); // import du package http natif Node pour gérer les requêtes serveur
const app = require('./app'); // import de l'application express

const normalizePort = (val) => {
  // fonction qui renvoie un port valide
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000'); // définit le port à utiliser 3000 par défaut ou un autre si l'environnement en utilise un autre

app.set('port', port); // indique à express quel port écouter j

const errorHandler = (error) => {
  // fonction qui gère les erreurs
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // transforme l'environnement local en serveur HTTP et prend en paramètre une fonction qui sera appelée à chaque requête = requestListener = express()

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); // écoute du port 3000 par défaut
