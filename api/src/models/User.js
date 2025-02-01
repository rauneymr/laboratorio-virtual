const { z } = require('zod');

const UserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }).optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string({ message: "Password must be a string" }),
  role: z.enum(['USER', 'ADMIN'], { 
    required_error: "Role must be either 'USER' or 'ADMIN'" 
  }).default('USER')
});

module.exports = {
  UserSchema
};
