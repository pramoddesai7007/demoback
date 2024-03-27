const express = require('express');
const router = express.Router();
const { upload } = require('../multerConfig');
const Hotel = require('../models/Hotel');
const Section = require('../models/Section')
const Table = require('../models/Table')
const MainCategory = require('../models/MainCategory')
const Menu = require('../models/Menu')


// API for adding a new company
let hotelCreated = false; // This flag indicates whether a hotel has been created

router.post('/create', upload.fields([{ name: 'hotelLogo', maxCount: 1 }, { name: 'qrCode', maxCount: 1 }]), async (req, res) => {
    try {
        // Check if a hotel has already been created
        if (hotelCreated) {
            console.log(hotelCreated)
            return res.status(400).json({ message: 'Hotel has already been created' });
        }
        // Continue with the hotel creation logic
        const { hotelName, address, email, contactNo, gstNo, sacNo, fssaiNo } = req.body;
        const hotelLogo = req.files['hotelLogo'] ? req.files['hotelLogo'][0].path : undefined;
        const qrCode = req.files['qrCode'] ? req.files['qrCode'][0].path : undefined;

        const newHotel = new Hotel({
            hotelName,
            address,
            email,
            contactNo,
            gstNo,
            sacNo,
            fssaiNo,
            hotelLogo,
            qrCode,
        });

        // Save the new hotel to the database
        const savedHotel = await newHotel.save();

        // Set the flag to indicate that the hotel has been created
        hotelCreated = true;

        res.status(201).json(savedHotel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// API for adding a new company
// router.post('/create', upload.fields([{ name: 'hotelLogo', maxCount: 1 }, { name: 'qrCode', maxCount: 1 }]), async (req, res) => {
//     try {
//         const { hotelName, address, email, contactNo, gstNo, sacNo, fssaiNo } = req.body;

//         // Extract the file paths from req.files
//         // const hotelLogo = req.files['hotelLogo'][0].path;
//         // const qrCode = req.files['qrCode'][0].path;

//         const hotelLogo = req.files['hotelLogo'] ? req.files['hotelLogo'][0].path : undefined;
//         const qrCode = req.files['qrCode'] ? req.files['qrCode'][0].path : undefined;

//         // Create a new company
//         const newHotel = new Hotel({
//             hotelName,
//             address,
//             email,
//             contactNo,
//             gstNo,
//             sacNo,
//             fssaiNo,
//             hotelLogo,
//             qrCode,
//         });
//         // Save the new company to the database
//         const savedCompany = await newHotel.save();
//         res.status(201).json(savedCompany);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// API to Edit the Hotel
router.patch('/edit/:hotelId', upload.fields([{ name: 'hotelLogo', maxCount: 1 }, { name: 'qrCode', maxCount: 1 }]), async (req, res) => {
    try {
        const { hotelName, address, email, contactNo, gstNo, sacNo, fssaiNo } = req.body;
        const { hotelId } = req.params;

        // Extract the file paths from req.files if they are provided
        let hotelLogo;
        let qrCode;

        if (req.files) {
            hotelLogo = req.files['hotelLogo'] ? req.files['hotelLogo'][0].path : undefined;
            qrCode = req.files['qrCode'] ? req.files['qrCode'][0].path : undefined;
        }

        // Find the hotel by ID
        const hotelToUpdate = await Hotel.findById(hotelId);

        if (!hotelToUpdate) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Update the hotel properties
        hotelToUpdate.hotelName = hotelName;
        hotelToUpdate.address = address;
        hotelToUpdate.email = email;
        hotelToUpdate.contactNo = contactNo;
        hotelToUpdate.gstNo = gstNo;
        hotelToUpdate.sacNo = sacNo;
        hotelToUpdate.fssaiNo = fssaiNo;

        // Update the file paths if provided
        if (hotelLogo) {
            hotelToUpdate.hotelLogo = hotelLogo;
        }

        if (qrCode) {
            hotelToUpdate.qrCode = qrCode;
        }

        // Save the updated hotel to the database
        const updatedHotel = await hotelToUpdate.save();

        res.status(200).json(updatedHotel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// API for deleting an existing hotel
router.delete('/delete/:hotelId', async (req, res) => {
    try {
        const { hotelId } = req.params;

        // Use findByIdAndDelete to find and delete the hotel by ID
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

        if (!deletedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// API for getting a single hotel by ID
router.get('/get/:hotelId', async (req, res) => {
    try {
        const { hotelId } = req.params;

        // Use findById to find the hotel by ID
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.status(200).json(hotel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// API for getting all hotels
router.get('/get-all', async (req, res) => {
    try {
        // Use find to get all hotels
        const hotels = await Hotel.find();

        res.status(200).json(hotels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


router.get('/counts', async (req, res) => {
    try {
        const sectionCount = await Section.countDocuments();
        const tableCount = await Table.countDocuments();
        const mainCategoryCount = await MainCategory.countDocuments();
        const menuCount = await Menu.countDocuments();

        res.json({
            sectionCount,
            tableCount,
            mainCategoryCount,
            menuCount,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.patch('/gst/:id', async (req, res) => {
    const { id } = req.params;
    const { gstPercentage } = req.body;

    try {
        const hotelToUpdate = await Hotel.findById(id);

        if (!hotelToUpdate) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        hotelToUpdate.gstPercentage = gstPercentage !== undefined ? gstPercentage : hotelToUpdate.gstPercentage;

        const updatedHotel = await hotelToUpdate.save();

        res.json(updatedHotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
