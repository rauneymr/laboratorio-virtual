const { z } = require('zod');

const UserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'PROFESSOR', 'ADMIN']).default('STUDENT')
});

module.exports = {
  UserSchema
};
