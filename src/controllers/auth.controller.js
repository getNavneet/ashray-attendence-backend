import { User } from '../models/user.model.js';
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email with case-insensitive search
    const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Compare passwords
    if (password === user.password) {
      // Successful login response
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
          phone: user.phone,
          photo: user.photo,
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
