const config = {
  mongo: {
    url: "",
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      socketTimeoutMS: 30000,
      keepAlive: true,
      autoIndex: false,
      retryWrites: false,
    },
  },
  firebase: {},
  server: {
    host: "localhost",
    port: 8080,
  },
};

export default config;
