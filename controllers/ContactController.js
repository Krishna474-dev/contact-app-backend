const Contact = require("../models/contactModel");

// Get all contacts
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ user_id: req.user.id });

    res.status(200).json({
      success: true,
      responseCode: 200,
      message: "Contacts retrieved successfully",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single contact
const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        responseCode: 404, // Corrected from 400 to 404
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      responseCode: 200,
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new contact
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        message: "All fields are mandatory",
      });
    }

    // Check for duplicate email/phone
    const existingContact = await Contact.findOne({
      user_id: req.user.id,
      $or: [{ email }, { phone }],
    });

    if (existingContact) {
      return res.status(409).json({
        // 409 for Conflict (Duplicate Entry)
        success: false,
        responseCode: 409,
        message: "Contact with this email or phone already exists",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      user_id: req.user.id,
    });

    res.status(201).json({
      // 201 for successful creation
      success: true,
      responseCode: 201,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Update contact
const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        responseCode: 404, // Corrected from 400 to 404
        message: "Contact not found",
      });
    }

    if (contact.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        // 403 for Forbidden
        success: false,
        responseCode: 403,
        message: "You are not authorized to update this contact",
      });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      responseCode: 200,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Delete contact
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        responseCode: 404, // Corrected from 400 to 404
        message: "Contact not found",
      });
    }

    if (contact.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        responseCode: 403, // Corrected from 400 to 403
        message: "You are not authorized to delete this contact",
      });
    }

    await Contact.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      responseCode: 200,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
