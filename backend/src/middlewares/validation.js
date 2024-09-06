const zod = require('zod');

const userSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
});

const todoSchema = zod.object({
    title: zod.string().min(1),
    description: zod.string().optional()
});

module.exports = {
    userSchema,
    todoSchema
}