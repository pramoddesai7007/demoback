
// // multerConfig.js
// const multer = require('multer');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const xlsx = require('xlsx'); // Add this line


// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // Determine the destination folder based on the file type
//         let uploadFolder;

//         switch (file.fieldname) {
//             case 'image':
//                 uploadFolder = 'uploads/pictures';
//                 break;
//             case 'mainImage':
//                 uploadFolder = 'uploads/mainImages';
//                 break;
//             case 'hotelLogo':
//                 uploadFolder = 'uploads/hotelLogos';
//                 break;
//             case 'qrCode':
//               uploadFolder = 'uploads/qrCodes';
//             break;
//             default:
//                 return cb(new Error('Invalid file type'), null);
//         }

//         cb(null, uploadFolder);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = uuidv4();
//         const ext = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//     },
// });

// const upload = multer({ storage });

// module.exports = { upload };

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const xlsx = require('xlsx'); // Add this line

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine the destination folder based on the file type
        let uploadFolder;

        switch (file.fieldname) {
            case 'image':
                uploadFolder = 'uploads/pictures';
                break;
            case 'mainImage':
                uploadFolder = 'uploads/mainImages';
                break;
            case 'hotelLogo':
                uploadFolder = 'uploads/hotelLogos';
                break;
            case 'qrCode':
                uploadFolder = 'uploads/qrCodes';
                break;
            default:
                // For any other fieldname, save in a general uploads folder
                uploadFolder = 'uploads/general';
        }

        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});

const upload = multer({ storage });

module.exports = { upload };


// const multer = require('multer');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const fs=require('fs')


// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Determine the destination folder based on the file type
//     let uploadFolder;

//     switch (file.fieldname) {
//       case 'image':
//         uploadFolder = 'uploads/pictures';
//         break;
//       case 'mainImage':
//         uploadFolder = 'uploads/mainImages';
//         break;
      // case 'hotelLogo':
      //   uploadFolder = 'uploads/hotelLogos';
      //   break;
      // case 'qrCode':
      //   uploadFolder = 'uploads/qrCodes';
      //   break;
//       default:
//         return cb(new Error('Invalid file type'), null);
//     }
    
//     cb(null, uploadFolder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = uuidv4();
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   },
// });

// const upload = multer({ storage });

// module.exports = { upload };
