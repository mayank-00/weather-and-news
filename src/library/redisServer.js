const RedisServer = require("redis-server");

const server = new RedisServer({
  port: 6379,
  bin: "/home/lenovo/Downloads/redis-6.2.6/src/redis-server",
});

server.open((err) => {
  if (err === null) {
    // eslint-disable-next-line global-require
    require("./redis");
  }
});
