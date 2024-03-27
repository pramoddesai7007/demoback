

const express = require('express');
const Section = require('../models/Section');
const Table = require('../models/Table');
const router = express.Router();


// Create tables API according to sections
router.post('/:sectionId/tables', async (req, res) => {
    const { sectionId } = req.params;
    const { numberOfTables } = req.body; // Assuming numberOfTables is a number

    try {
        const section = await Section.findById(sectionId);

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Check if the provided number of tables is valid
        if (!Number.isInteger(numberOfTables) || numberOfTables <= 0) {
            return res.status(400).json({ message: 'Invalid number of tables provided' });
        }

        const existingTableNames = new Set(section.tableNames.map(table => table.tableName)); // Using Set for efficient lookup

        // Determine the highest numbered table already present
        let highestTableNumber = 0;
        existingTableNames.forEach(tableName => {
            const match = tableName.match(/\d+/);
            if (match) {
                const tableNumber = parseInt(match[0], 10);
                if (!isNaN(tableNumber) && tableNumber > highestTableNumber) {
                    highestTableNumber = tableNumber;
                }
            }
        });

        const savedTables = [];
        for (let i = 0; i < numberOfTables; i++) {
            let tableNumber = highestTableNumber + i + 1;
            let tableName = '';

            // Check if the section name is "room section" to prefix table names with "R"
            if (section.name.toLowerCase() === 'room section') {
                tableName = `ROOM${tableNumber}`;
            } else {
                tableName = `${tableNumber}`;
            }

            // Check if the generated table name already exists in the section
            while (existingTableNames.has(tableName)) {
                tableNumber++;
                tableName = `${tableNumber}`;
            }

            // Create and save the new table
            const newTable = new Table({
                tableName,
                section: { name: section.name, _id: sectionId }
            });
            const savedTable = await newTable.save();
            savedTables.push(savedTable);

            // Update the Set of existing table names
            existingTableNames.add(tableName);

            // Update the Section document with the new table name and table ID
            section.tableNames.push({ tableName: savedTable.tableName, tableId: savedTable._id });
        }

        // Save the updated section with new table names and table IDs
        await section.save();

        res.status(201).json(savedTables);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Divide table API
router.post('/tables/:id/divide', async (req, res) => {
    const { id } = req.params;
    const { numberOfSubparts } = req.body; // Assuming numberOfSubparts is provided in the request body

    try {
        const originalTable = await Table.findById(id);

        if (!originalTable) {
            return res.status(404).json({ message: 'Table not found' });
        }

        const sectionId = originalTable.section._id;

        // Ensure numberOfSubparts is a positive integer
        if (!Number.isInteger(numberOfSubparts) || numberOfSubparts <= 0) {
            return res.status(400).json({ message: 'Invalid number of subparts' });
        }

        const originalItems = originalTable.items || []; // Ensure items array exists

        // Calculate the number of items per subpart
        const itemsPerSubpart = Math.ceil(originalItems.length / numberOfSubparts);

        // Find existing subtables associated with the parent table and sort them alphabetically by name
        const existingSubtables = await Table.find({ parentTable: originalTable._id }).sort({ tableName: 1 });

        // Determine the next table name based on the last subtable's name
        let nextTableName = '';
        if (existingSubtables.length > 0) {
            const lastSubtable = existingSubtables[existingSubtables.length - 1];
            const lastTableName = lastSubtable.tableName;
            const lastAlphabet = lastTableName.split(' ')[1]; // Extract the last alphabet from the last subtable name
            nextTableName = `${originalTable.tableName} ${String.fromCharCode(lastAlphabet.charCodeAt(0) + 1)}`;
        } else {
            nextTableName = `${originalTable.tableName} A`; // If no subtables exist, start with alphabet 'A'
        }

        // Divide the items of the original table into subparts
        const subparts = [];
        for (let i = 0; i < numberOfSubparts; i++) {
            const startIndex = i * itemsPerSubpart;
            const endIndex = Math.min((i + 1) * itemsPerSubpart, originalItems.length);
            const subpartItems = originalItems.slice(startIndex, endIndex);

            // Create a new subpart object
            const subpart = new Table({
                tableName: nextTableName,
                section: originalTable.section,
                items: subpartItems,
                parentTable: originalTable._id // Store the parent table's ID for reference
            });

            const savedSubpart = await subpart.save();
            subparts.push(savedSubpart);

            // Increment the next table name alphabetically
            nextTableName = `${originalTable.tableName} ${String.fromCharCode(nextTableName.split(' ')[1].charCodeAt(0) + 1)}`;
        }

        res.status(200).json({ tableId: originalTable._id, subparts });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Define the route handler for fetching table by section and name
router.get('/table/bySectionAndName/:sectionId/:name', async (req, res) => {
    const { sectionId, name } = req.params;

    try {
        // Find the table by section ID and name
        const table = await Table.findOne({ "section._id": sectionId, tableName: name });

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // If found, return the table details
        res.status(200).json(table);
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error fetching table by section and name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// DELETE endpoint to delete a subtable of a table by tableId within a particular section
router.delete('/tables/:parentId/:sectionId/clearSubtables', async (req, res) => {
    const { parentId, sectionId } = req.params;

    try {
        // Find the parent table
        const parentTable = await Table.findById(parentId);

        if (!parentTable) {
            return res.status(404).json({ message: 'Parent table not found' });
        }

        // Ensure that the parent table belongs to the specified section
        if (parentTable.section !== sectionId) {
            return res.status(400).json({ message: 'Parent table does not belong to the specified section' });
        }

        // Find all subtables associated with the parent table
        const subtables = await Table.find({ parentTable: parentTable._id });

        // Delete all subtables
        await Table.deleteMany({ parentTable: parentTable._id });

        res.status(200).json({ message: 'Subtables deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});




router.patch('/tables/:id', async (req, res) => {
    const { id } = req.params;
    const { tableName, sectionId } = req.body;

    try {
        const tableToUpdate = await Table.findById(id);

        if (!tableToUpdate) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Update the table name
        tableToUpdate.tableName = tableName !== undefined ? tableName : tableToUpdate.tableName;

        // If the table is associated with a section, update the association
        if (sectionId && sectionId !== tableToUpdate.section?._id.toString()) {
            const newSection = await Section.findById(sectionId);

            if (!newSection) {
                return res.status(404).json({ message: 'Section not found' });
            }

            // Update the section reference in the table
            tableToUpdate.section = { name: newSection.name, _id: newSection._id };
        }

        const updatedTable = await tableToUpdate.save();

        // If the table is associated with a section, update the section's table name
        if (tableToUpdate.section && tableToUpdate.section._id) {
            const section = await Section.findById(tableToUpdate.section._id);

            if (section) {
                const tableIndex = section.tableNames.findIndex(
                    (table) => table.tableId.toString() === updatedTable._id.toString()
                );

                if (tableIndex !== -1) {
                    section.tableNames[tableIndex].tableName = updatedTable.tableName;
                    await section.save();
                }
            }
        }

        res.json(updatedTable);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Delete table API
router.delete('/tables/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const tableToDelete = await Table.findByIdAndDelete(id);

        if (!tableToDelete) {
            return res.status(404).json({ message: 'Table not found' });
        }

        const sectionId = tableToDelete.section ? tableToDelete.section._id : null;

        // If the table was associated with a section, remove table reference from the section
        if (sectionId) {
            const section = await Section.findById(sectionId);

            if (section) {
                section.tableNames = section.tableNames.filter(
                    (table) => table.tableId.toString() !== id.toString()
                );
                await section.save();
            }
        }

        res.json({ message: 'Table deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Get all tables List API
router.get('/tables', async (req, res) => {
    try {
        const tables = await Table.find();
        res.json(tables);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get Single Table API
router.get('/tables/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const table = await Table.findById(id);

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        res.json(table);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.post('/tables/split/:tableId', async (req, res) => {
    const { tableId } = req.params;
    const { parts } = req.body; // Number of parts to split the table into
  
    try {
      // Find the main table by its ID
      const mainTable = await Table.findById(tableId);
      if (!mainTable) {
        return res.status(404).json({ error: 'Main table not found' });
      }
  
      // Split the main table into parts
      const splitTables = [];
      for (let i = 0; i < parts; i++) {
        const splitTableName = `${mainTable.tableName}${String.fromCharCode(65 + i)}`;
        const newSplitTable = {
          tableName: splitTableName,
          section: mainTable.section,
          parentTable: mainTable._id,
          tableId: mainTable._id,
          // Add other fields specific to the tables here
        };
        mainTable.splitTables.push(newSplitTable); // Push the split table to the main table's array of split tables
        splitTables.push(newSplitTable);
      }
  
      // Save the main table with split tables
      await mainTable.save();
  
      // Return the split tables in the response
      res.json({ splitTables });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  

module.exports = router;
