// Config
const express = require('express');
const app = express();
const http = require('http');
const port = 9002;
const server = http.createServer(app);
const io = require("socket.io")(server,  {});
const cors = require('cors');
app.use(cors());

const users = require("./configs/users");


var clients = {};

// on socket connection 
io.on("connection", function(client) {

    // on sign in event
    client.on("sign-in", e => {

      // get user id
      let user_id = e.id;

      // if user id is invalid, return control
      if (!user_id) return;

      // set client id
      client.user_id = user_id;

      // if user id exists in clients
      if (clients[user_id]) {

        // push client
        clients[user_id].push(client);
      } else {

        // else set client
        clients[user_id] = [client];
      }
    });
    
    // on message event
    client.on("message", e => {

      // get receiver id
      let targetId = e.to;

      // get sender id 
      let sourceId = client.user_id;

      // if target id and object both are valid
      if(targetId && clients[targetId]) {

        clients[targetId].forEach(cli => {

          // emit message
          cli.emit("message", e);
        });
      }
      
      // if source id and object are valid
      if(sourceId && clients[sourceId]) {
        clients[sourceId].forEach(cli => {

          // emit message
          cli.emit("message", e);
        });
      }
    });
    
    // on disconnect 
    client.on("disconnect", function() {

      // if invalid user id and client
      if (!client.user_id || !clients[client.user_id]) {

        // return 
        return;
      }

      // get target clients
      let targetClients = clients[client.user_id];

      // for each target client
      for (let i = 0; i < targetClients.length; ++i) {

        // when client matches
        if (targetClients[i] === client) {

          // splice target clients
          targetClients.splice(i, 1);
        }
      }
    });
  });
  
  // get request for users
  app.get("/users", (req, res) => {

    // send users 
    res.send({ data: users });
  });
  

  // start server and listen to port 
  server.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
  );
  