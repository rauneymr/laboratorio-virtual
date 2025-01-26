const { z } = require('zod');

const UserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    { message: "Password must include uppercase, lowercase, number, and special character" }),
  role: z.enum(['user', 'admin'], { 
    required_error: "Role must be either 'user' or 'admin'" 
  }).default('user')
});

module.exports = {
  UserSchema
};
