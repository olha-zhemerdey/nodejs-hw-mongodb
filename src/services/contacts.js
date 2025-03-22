import { SORT_ORDER } from '../constants/index.js';
import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const contactsCount = await ContactsCollection.find({ userId })
    .merge(contactsQuery)
    .countDocuments();

  const totalPages = Math.ceil(contactsCount / perPage);
  if (page > totalPages && totalPages > 0) {
    throw createHttpError(400, 'Invalid page number');
  }

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return ContactsCollection.create(payload);
};

export const updateContact = async (contactId, payload, userId) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, includeResultMetadata: true },
  );

  return updatedContact.value;
};

export const deleteContact = (contactId, userId) => {
  return ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
};
