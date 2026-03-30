const User = require('../models/User');

// Create Admin (Super Admin only)
const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const admin = new User({
      name,
      email,
      phone,
      password,
      role: 'admin',
      createdBy: req.user._id
    });
    
    await admin.save();
    
    res.status(201).json({
      message: 'Admin created successfully',
      admin: { ...admin.toObject(), password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all Admins (Super Admin only)
const getAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const query = {
      role: 'admin',
      createdBy: req.user._id
    };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const total = await User.countDocuments(query);
    const admins = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.json({
      admins,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;
    
    const admin = await User.findOne({ _id: id, role: 'admin', createdBy: req.user._id });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;
    if (password) admin.password = password;
    
    await admin.save();
    
    res.json({
      message: 'Admin updated successfully',
      admin: { ...admin.toObject(), password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const admin = await User.findOneAndDelete({ _id: id, role: 'admin', createdBy: req.user._id });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createAdmin, getAdmins, updateAdmin, deleteAdmin };