// // const mongoose = require('mongoose');
// // const { Schema } = mongoose;

// // const tableSchema = new Schema({
// //     tableName: {
// //         type: String,
// //         required: true,
      
// //     },
// //     section: {
// //         name: {
// //             type: String,
// //             required: true,
// //         },
// //         _id: {
// //             type: Schema.Types.ObjectId,
// //             ref: 'Section',
// //             required: true,
// //         },
// //     },
// // });


// // const Table = mongoose.model('Table', tableSchema);
// // module.exports = Table;


// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const tableSchema = new Schema({
//     tableName: {
//         type: String,
//         required: true,
//     },
//     section: {
//         name: {
//             type: String,
//             required: true,
//         },
//         _id: {
//             type: Schema.Types.ObjectId,
//             ref: 'Section',
//             required: true,
//         },
//     },
//     parentTable: {
//         type: Schema.Types.ObjectId,
//         ref: 'Table',
//     },
//     tableId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Table',
//     },
//     items: [String]
// });

// const Table = mongoose.model('Table', tableSchema);
// module.exports = Table;


const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a sub-schema for the tables
const tableSubSchema = new Schema({
    tableName: {
        type: String,
        required: true,
    },
    section: {
        name: {
            type: String,
            required: true,
        },
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Section',
            required: true,
        },
    },
    parentTable: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
    },
    tableId: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
    },
    // Add other fields specific to the tables here
});

// Define the main schema using the sub-schema
const tableSchema = new Schema({
    tableName: {
        type: String,
        required: true,
    },
    section: {
        name: {
            type: String,
            required: true,
        },
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Section',
            required: true,
        },
    },
    parentTable: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
    },
    tableId: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
    },
    splitTables: [tableSubSchema] // Array of sub-schema for split tables
});

module.exports = mongoose.model('Table', tableSchema);
