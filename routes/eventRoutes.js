const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController')
const {fileUpload} = require('../middleware/fileUpload');
const {isAuthenticated, isEventOwner, isNotEventOwner} = require('../middleware/auth');
const {isValidId, eventValidator, rsvpValidator, validationResults} = require('../middleware/validators');

//GET all events
router.get('/', controller.index);

//GET form to add a new event
router.get('/new', isAuthenticated, controller.new);

//POST a new event
router.post('/', isAuthenticated, fileUpload, eventValidator, validationResults, controller.create);

//GET event by id
router.get('/:id', isValidId, controller.show);

//GET edit form for specific event
router.get('/:id/edit', isValidId, isAuthenticated, isEventOwner, controller.edit);

//PUT update an event by id
router.put('/:id', isValidId, isAuthenticated, isEventOwner, fileUpload, eventValidator, validationResults, controller.update);

//DELETE event by id
router.delete('/:id', isValidId, isAuthenticated, isEventOwner, controller.delete);

//POST a new RSVP to specific event
router.post('/:id/rsvp', isValidId, isAuthenticated, isNotEventOwner, rsvpValidator, validationResults, controller.rsvp)

module.exports = router;