const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const app = express()
const PORT = 8050;
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const messages = [
  { author: "Juan", text: "¡Hola! ¿Que tal?" },
  { author: "Pedro", text: "¡Muy bien! ¿Y vos?" },
  { author: "Ana", text: "¡Genial!" }
];

app.use(express.static('./public'))
app.get('/', (req, res) => {
  res.sendFile('index.html')
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

httpServer.listen(PORT, () => console.log('Server running in http://localhost:8050'));

io.on('connection',socket => {
  console.log('Un cliente se ha conectado');
  socket.emit('messages', messages);

  socket.on('new-message',data => {
      messages.push(data);
      io.sockets.emit('messages', messages);
  });
  socket.off('disconnect' , reason => console.log({ reason }))
});