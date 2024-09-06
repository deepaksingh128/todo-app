const express = require('express');
const { TodoController } = require('../controllers/index');
const { AuthMiddleware } = require('../middlewares/index');

const router = express.Router();

router.post('/', AuthMiddleware.authenticate, TodoController.addTodo);
router.get('/', AuthMiddleware.authenticate, TodoController.getTodos);
router.put('/:id', AuthMiddleware.authenticate, TodoController.updateTodo);
router.delete('/:id', AuthMiddleware.authenticate, TodoController.deleteTodo);
router.patch('/:id/complete', AuthMiddleware.authenticate, TodoController.markComplete);


module.exports = router;