import {  promises as fsPromises } from 'fs';
import formidable from 'formidable';
import pdfParse from 'pdf-parse';
import db from '../../../utils/db';
import Knowledge from '../../../models/knowledgeBase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const form = formidable({});

  const formFields = await new Promise(function (resolve, reject) {
    form.parse(req, async function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        files,fields
      });
    });
  });

  const pdfFile = formFields.files.pdfFile[0]; // Replace 'file' with the field name of the PDF input

  if (!pdfFile) {
    res.status(400).json({ error: 'No PDF file found in the request.' });
    return;
  }

  const pdfData = await fsPromises.readFile(pdfFile.filepath);
  const options = {}; // You can add options if needed, e.g., { max: 1 } to extract only the first page
  const pdfText = await pdfParse(pdfData, options);

  // Trim whitespace and remove empty lines from the PDF
  const trimmedText = pdfText.text
    .replace(/^\s+|\s+$/gm, '')
    .replace(/^\s*\n/gm, '');

  await db.connect();


  const knowledge = await Knowledge.create({
    siteURL: formFields.fields.siteURL[0],
    text: trimmedText,
  });

  await knowledge.save();

  await db.disconnect();

  res.status(200).json({ text: 'knowledge saved' });
};
