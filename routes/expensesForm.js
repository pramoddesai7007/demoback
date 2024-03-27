const express = require('express');
const ExpensesForm = require('../models/ExpensesForm');
const router = express.Router();


// Create ExpensesForm
// router.post('/', async (req, res) => {
//   try {
//     const { date, expenseTitle, expenseType, description, paidBy, bankName, checkNo, amount } = req.body;
//     const newExpensesForm = new ExpensesForm({ date, expenseTitle, expenseType, description, paidBy, bankName, checkNo, amount });
//     const savedExpensesForm = await newExpensesForm.save();
//     res.json(savedExpensesForm);
//   } catch (error) {
//     console.error('Error creating expenses form:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });  


router.post('/', async (req, res) => {
  try {
    // Input validation
    const { date, expenseTitle, expenseType, description, paidBy, bankName, checkNo,online, amount } = req.body;
    if (!date  || !expenseType || !paidBy || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newExpensesForm = new ExpensesForm({ date, expenseTitle, expenseType, description, paidBy, bankName, checkNo,online, amount });
    const savedExpensesForm = await newExpensesForm.save();
    res.status(201).json(savedExpensesForm);
  } catch (error) {
    console.error('Error creating expenses form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All ExpensesForms
router.get('/', async (req, res) => {
  try {
    const expensesForms = await ExpensesForm.find();
    res.json(expensesForms);
  } catch (error) {
    console.error('Error getting expenses forms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get ExpensesForm by ID
router.get('/:id', async (req, res) => {
  try {
    const expensesForm = await ExpensesForm.findById(req.params.id);
    if (expensesForm) {
      res.json(expensesForm);
    } else {
      res.status(404).json({ error: 'Expenses form not found' });
    }
  } catch (error) {
    console.error('Error getting expenses form by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/total-amount-for-previous-month', async (req, res) => {
  try {
    const startDate = moment().subtract(1, 'months').startOf('month'); // Get the start of the previous month
    const endDate = moment().startOf('month'); // Get the start of the current month

    const totalForPreviousMonth = await ExpensesForm.aggregate([
      {
        $match: {
          date: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }, // Replace 'amount' with the actual field you want to sum
        },
      },
    ]);

    // If there are no expenses for the previous month, set total to 0
    const result = totalForPreviousMonth.length > 0 ? totalForPreviousMonth[0].total : 0;

    res.json({ totalForPreviousMonth: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/total-amount-for-last-day', async (req, res) => {
  try {
    const startDate = moment().subtract(1, 'days').startOf('day'); // Get the start of the last day
    const endDate = moment().endOf('day'); // Get the end of the current day

    const totalForLastDay = await ExpensesForm.aggregate([
      {
        $match: {
          date: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }, // Replace 'amount' with the actual field you want to sum
        },
      },
    ]);

    // If there are no expenses for the last day, set total to 0
    const result = totalForLastDay.length > 0 ? totalForLastDay[0].total : 0;

    res.json({ totalForLastDay: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Update ExpensesForm by ID
router.patch('/:id', async (req, res) => {
  try {
    const updatedExpensesForm = await ExpensesForm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedExpensesForm) {
      res.json(updatedExpensesForm);
    } else {
      res.status(404).json({ error: 'Expenses form not found' });
    }
  } catch (error) {
    console.error('Error updating expenses form by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete ExpensesForm by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedExpensesForm = await ExpensesForm.findByIdAndDelete(req.params.id);
    if (deletedExpensesForm) {
      res.json({ message: 'Expenses form deleted successfully' });
    } else {
      res.status(404).json({ error: 'Expenses form not found' });
    }
  } catch (error) {
    console.error('Error deleting expenses form by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;