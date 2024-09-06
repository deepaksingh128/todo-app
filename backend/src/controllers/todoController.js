const Todo = require('../models/Todo');
const { ValidateMiddleware } = require('../middlewares')

const addTodo = async (req, res) => {
    try {
        const validationResult = ValidateMiddleware.todoSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({msg: "Not a valid todo"});
        }

        const { title, description } = validationResult.data;
        const todo = await Todo.create({
            title: title,
            description: description,
            userId: req.user.id
        });
        res.status(201).json({msg: "Todo created successfuly"});

    } catch (error) {
        res.status(400).json({
            msg: "Error in creating Todo",
            error: error
        });
    }
}


const getTodos = async (req, res) => {
    try {
        const id = req.user.id;
        const todos = await Todo.find({userId: id});
        res.status(200).json({
            todos: todos
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error in fetching todos",
            error: error
        });
    }
}

const updateTodo = async (req, res) => {
    try {
        const todoId = req.params.id;

        const todo = await Todo.findById(todoId);
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        if (todo.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const validationResult = ValidateMiddleware.todoSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
            message: 'Validation error',
            errors: validationResult.error.errors,
            });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            validationResult.data,  
            { new: true, runValidators: true }  
        );

        res.status(200).json({
            msg: "Todo updated successfully",
            todo: updatedTodo
        });
    } catch (error) {
        res.status(400).json({
            msg: "Error in updating todo",
            error: error.message
        })
    }
}

const deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        
        const todo = await Todo.findById(todoId);
        
        if (!todo) {
            return res.status(400).json({msg: "Todo not found"});
        }
        
        if (todo.userId.toString() !== req.user.id) {
            return res.status(403).json({msg: "Not authorized"});
        } 
        
        await Todo.deleteOne( {_id: todoId } , { userId: req.user.id });
        res.status(200).json({msg: "Todo deleted"});
    } catch (error) {
        res.status(400).json({
            msg: "Error in deleting todo",
            error: error.message
        });
    }
}


const markComplete = async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({msg: "Todo not found"});
        }

        if (todo.userId.toString() !== req.user.id) {
            return res.status(403).json({msg: "Not authorized"});
        }
        
        if (todo.completed === true) {
            return res.status(200).json({msg: "Already Marked as completed"});
        }
        
        await Todo.updateOne({_id: todoId}, { $set: { completed: true } });
        const updatedTodo = await Todo.findById(todoId);
        res.status(200).json({
            msg: "Marked as completed",
            todo: updatedTodo
        });

    } catch (error) {
        res.status(400).json({
            msg: "Error in Mark as Done operation",
            error: error.message
        });
    }
}

module.exports = {
    addTodo,
    getTodos,
    updateTodo,
    deleteTodo,
    markComplete
}