const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json")

swaggerDocument.info.version = "1"


const swaggerDocs = (app, port, host) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

    console.log(`Docs available at ${host}:${port}/api-docs`)
}


module.exports = swaggerDocs
