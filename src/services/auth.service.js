const Owner = require('../models/owner.model');
const hashing = require('../utils/hashing');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { sendEmail, generateVerificationTemplate,generateLoginNotificationTemplate } = require('../utils/email');


async function registerOwner(req, res) {
    const { firstName, lastName, email, mobileNumber, password } = req.body;

    try {
        // Check if an owner with the same email or mobile number already exists
        const existingOwner = await Owner.findOne({
            $or: [{ 'contact.email': email }, { 'contact.mobileNumber': mobileNumber }],
        });

        if (existingOwner) {
            throw new Error('Owner with this email or mobile number already exists');
        }

        // Hash the password
        const { passwordHash, salt } = await hashing.hashPassword(password);

        // Create a new owner
        const newOwner = new Owner({
            ownerName: { firstName, lastName },
            contact: { email, mobileNumber },
            authentication: { passwordHash, salt },
        });

        await newOwner.save();
      
        // Send a success response with the new owner data
        return  {
            id: newOwner._id,
            ownerName: newOwner.ownerName,
            contact: newOwner.contact,
        };

    } catch (error) {
        console.error('Error during owner registration:', error);
        throw new Error(error.message);
    }
}


async function loginOwner(identifier, password) {
    try {
      console.log('Login attempt for:', identifier);
      const owner = await Owner.findOne({
        $or: [{ 'contact.email': identifier }, { 'contact.mobileNumber': identifier }],
      });
  
      if (!owner) {
        console.log('Owner not found');
        throw new Error('Owner not found');
      }
  
      console.log('Owner found:', owner);
  
      const passwordMatch = await hashing.comparePasswords(
        password,
        owner.authentication.passwordHash,
        owner.authentication.salt
      );
  
      if (!passwordMatch) {
        console.log('Password mismatch');
        throw new Error('Invalid credentials');
      }
  
      if (!owner.authentication.accountVerified) {
        console.log('Account not verified');
        throw new Error('Account not verified');
      }
  
      const token = jwt.sign({ ownerId: owner._id }, JWT_SECRET, { expiresIn: '1h' });
  
      owner.authentication.lastLogin = new Date();
      await owner.save();
  

       // Send verification email
       // Replace with your actual verification link

       let ownerName = owner?.ownerName?.firstName+""+owner?.ownerName?.lastName

      //  await sendEmail(
      //    "avinashavi2048@gmail.com",
      //    'Sucessfully loged In',
      //    generateLoginNotificationTemplate(ownerName,new Date()) // (name,time)
      //  );

      console.log('Login successful');
      return { token, ownerId: owner._id };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

async function verifyAccount(ownerId) {
  const owner = await Owner.findById(ownerId);
  if (!owner) {
    throw new Error('Owner not found');
  }
  owner.authentication.accountVerified = true;
  await owner.save();
}



async function changePassword(ownerId, oldPassword, newPassword) { 

    const owner = await Owner.findById(ownerId);
  
    if (!owner) {
      throw new Error('Owner not found');
    }
  
    const passwordMatch = await hashing.comparePasswords(
      oldPassword,
      owner.authentication.passwordHash,
      owner.authentication.salt
    );
  
    if (!passwordMatch) {
      throw new Error('Incorrect old password');
    }
  
    const { passwordHash, salt } = await hashing.hashPassword(newPassword);
  
    owner.authentication.passwordHash = passwordHash;
    owner.authentication.salt = salt;
    await owner.save();
  
    return { message: 'Password changed successfully' };
  }
  

module.exports = { registerOwner, loginOwner, verifyAccount,changePassword };