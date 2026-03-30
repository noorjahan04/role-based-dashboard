const User = require('../models/User');

// Create User
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'user' } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const user = new User({
      name,
      email,
      phone,
      password,
      role,
      createdBy: req.user._id
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'User created successfully',
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Users (based on role)
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    let query = { role: 'user' };
    
    // Super Admin sees all users, Admin sees only their users
    if (req.user.role === 'admin') {
      query.createdBy = req.user._id;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;
    
    let query = { _id: id, role: 'user' };
    
    if (req.user.role === 'admin') {
      query.createdBy = req.user._id;
    }
    
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = password;
    
    await user.save();
    
    res.json({
      message: 'User updated successfully',
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    let query = { _id: id, role: 'user' };
    
    if (req.user.role === 'admin') {
      query.createdBy = req.user._id;
    }
    
    const user = await User.findOneAndDelete(query);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser };