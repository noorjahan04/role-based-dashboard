const Note = require('../models/Note');

// Create Note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const note = new Note({
      title,
      content,
      userId: req.user._id
    });
    
    await note.save();
    
    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User's Notes
const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    let query = { userId: req.user._id };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const total = await Note.countDocuments(query);
    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.json({
      notes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (title) note.title = title;
    if (content) note.content = content;
    
    await note.save();
    
    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };