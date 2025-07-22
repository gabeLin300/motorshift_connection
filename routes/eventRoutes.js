const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController')
const {fileUpload} = require('../middleware/fileUpload');

//GET all events
router.get('/', controller.index);

//GET form to add a new event
router.get('/new', controller.new);

//POST a new event
router.post('/', fileUpload, controller.create);

//GET event by id
router.get('/:id', controller.show);

//GET edit form for specific event
router.get('/:id/edit', controller.edit);

//PUT update an event by id
router.put('/:id', fileUpload, controller.update);

//DELETE event by id
router.delete('/:id', controller.delete);

module.exports = router;