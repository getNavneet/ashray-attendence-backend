import { User } from '../models/user.model.js';




export const login = async (req, res) => {
    const { email, password } = req.body;
        console.log(email);
        console.log(password);
    try {
        // Find user by username
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare hashed password
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({ message: 'Invalid credentials' });
        // }
         

         if(password == user.password){
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
    } // try block ends
    catch (error) {
        res.status(500).json({ error: error.message });
    }

}
