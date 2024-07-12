const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swagger = require('../swagger/swagger.json');
const router = express.Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swagger));

module.exports = router;
