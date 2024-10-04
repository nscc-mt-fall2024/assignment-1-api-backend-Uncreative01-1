import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Prisma setup
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/'); // save uploaded files in `public/images` folder
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop(); // get file extension
    const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext; // generate unique filename - current timestamp + random number between 0 and 1000.
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });
  

 //
 // Routes
 // 

// Get all contacts
router.get('/all', async (req, res) => {
  const contacts = await prisma.contact.findMany(); 

  res.json(contacts);
});

// Get a contact by id
router.get('/get/:id', async (req, res) => {
  const id = req.params.id;

  // Validate id is a number
  if(isNaN(id)){
    return res.status(400).json({ message: 'Invalid contact ID.'});    
  }

  // By ID
  const contact = await prisma.contact.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if(contact) {
    res.json(contact);
  } 
  else {
    res.status(404).json({ message: 'Contact not found.'});
  }  
});

// Add a new contact (with Multer)
router.post('/create', upload.single('image'), async (req, res) => {
  const filename = req.file ? req.file.filename : null;
  const { firstName, lastName, email, phone, title } = req.body;

  if(!firstName || !lastName || !email || !phone) {
    // to-do:delete uploaded file
    return res.status(400).json({message: 'Required fields must have a value.'});
  }

  const contact = await prisma.contact.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      title: title,
      filename: filename
    },
  });

  res.json(contact);
});

// Update a contact by id (with Multer)
router.put('/update/:id', upload.single('image'), async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, phone, title } = req.body;
  const newFilename = req.file ? req.file.filename : null;

  const contact = await prisma.contact.findUnique({
      where: { id: parseInt(id) },
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    
    const updatedContact = await prisma.contact.update({
      where: { id: parseInt(id) },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        title: title,
        filename: newFilename
      },
    });

  res.send(updatedContact);
  
  
  // try {

    


  //   // Delete the old image if a new one is uploaded
  //   if (newFilename && contact.filename) {
  //     fs.unlinkSync(`public/images/${contact.filename}`);
  //   }



//     res.json(updatedContact);
//   } catch (error) {
//     if (newFilename) fs.unlinkSync(`public/images/${newFilename}`);
//     res.status(500).json({ message: 'Error updating contact.', error });
//   }
});


// Delete a contact by id
router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  //try 
    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!contact) {
       return res.status(404).json({ message: 'Contact not found.' });
  }

  const Deletedcontact = await prisma.contact.delete({

          where: { id: parseInt(id) },
        });
    res.send("Contact Deleted")
    
//     
//     }

//     if (contact.filename) {
//       fs.unlinkSync(`public/images/${contact.filename}`); // Delete image
//     }


//     const Deletedcontact = await prisma.contact.delete({

//       where: { id: parseInt(id) },
//     });

//     res.json({ message: 'Contact deleted successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting contact.', error });
//   }
});

export default router;

// capture the remaining inputs (90)

  // validate the inputs

  // get contact by id. return 404 if not found.

  // if image file is uploaded: get the filename to save in db. delete the old image file. set the filename to newfilename
  
  // if image file NOT uploaded: when updating record with prisma, set the filename to oldfilename (108)

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // update record in the database (ensuring filename is new or old name) (99)

    // validate the input

  // get contact by id. return 404 if not found.

  // delete the image file

  // delete the contact in database (114)

  //http://localhost:3000/api/contacts/all

  //Update

  //Delete