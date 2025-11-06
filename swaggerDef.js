const host = `http://${process.env.IP}:${process.env.PORT}`;

module.exports = {
  openapi: "3.0.2",
  info: {
    // API informations (required)
    title: "Hello World", // Title (required)
    version: "1.0.0", // Version (required)
    description: "A sample API", // Description (optional)
  },
  host, // Host (optional)
  basePath: "/", // Base path (optional)
};
