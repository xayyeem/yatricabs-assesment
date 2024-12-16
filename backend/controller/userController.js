const User = require('../model/user')
const bcrypt = require('bcrypt')
// Returns a list of all users
exports.getAllUser = async (req, res) => {
    try {
        const user = await User.find({})
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        console.error('Error getting all users', error)
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}


// Returns the user with the specified ID
exports.getDataWithId = async (req, res) => {
    try {
        const user = req.params.id
        const foundUser = await User.findById(user)
        if (!foundUser) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            data: foundUser
        })
    } catch (error) {
        console.error('Error getting user', error)
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

//  Creates a new user with the provided data.
exports.createUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, role } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err });
    }
};


// Updates the user with the specified ID.
exports.updateUser = async (req, res) => {
    try {
        const user = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(user, req.body, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedUser
        })
    } catch (error) {
        console.error('Error updating user', error)
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

// Deletes the user with the specified ID. 
exports.deleteUser = async (req, res) => {
    try {
        const user = req.params.id;

        const deletedUser = await User.findByIdAndDelete(user)
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting user', error)
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

