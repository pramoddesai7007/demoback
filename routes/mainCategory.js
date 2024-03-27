// routes/mainCategoryRoutes.js
const express = require('express');

const router = express.Router();
const { upload } = require('../multerConfig');
const MainCategory = require('../models/MainCategory');

router.post('/', upload.single('mainImage'), async (req, res) => {
  const { name } = req.body;

  try {
    // Get the file path (if an image was uploaded)
    const mainImage = req.file ? req.file.path : undefined;

    const newMainCategory = new MainCategory({ name, mainImage });
    const savedMainCategory = await newMainCategory.save();
    res.status(201).json(savedMainCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Edit an existing main category
router.patch('/:id', upload.single('mainImage'), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const mainCategoryToUpdate = await MainCategory.findById(id);

    if (!mainCategoryToUpdate) {
      return res.status(404).json({ message: 'Main category not found' });
    }

    // If a new mainImage is uploaded, update the mainCategory's mainImage
    if (req.file) {
      mainCategoryToUpdate.mainImage = req.file.path;
    }

    mainCategoryToUpdate.name = name !== undefined ? name : mainCategoryToUpdate.name;

    const updatedMainCategory = await mainCategoryToUpdate.save();
    res.json(updatedMainCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all main categories
router.get('/', async (req, res) => {
  try {
    const mainCategories = await MainCategory.find();
    res.json(mainCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// routes/mainCategoryRoutes.js
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const mainCategory = await MainCategory.findById(id);

      if (!mainCategory) {
          return res.status(404).json({ message: 'Main category not found' });
      }

      res.json(mainCategory);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


// Delete a main category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMainCategory = await MainCategory.findByIdAndDelete(id);
    res.json({ message: 'Main category deleted successfully', deletedMainCategory });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
