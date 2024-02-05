import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pdfFiles = ['utils/kiddo.pdf', 'utils/nani.pdf'];

const readPdf = async () => {
  try {
    const combinedText = [];

    for (const file of pdfFiles) {
    //   const filePath = join(__dirname, file);
      const pdfData = await fs.promises.readFile(file);
      const options = {}; // You can add options if needed, e.g., { max: 1 } to extract only the first page
      const pdfText = await pdfParse(pdfData, options);

      // Trim whitespace and remove empty lines from each PDF
      const trimmedText = pdfText.text
        .replace(/^\s+|\s+$/gm, '')
        .replace(/^\s*\n/gm, '');
      combinedText.push(trimmedText);
    }

    return combinedText.join('\n\n'); // Separate text from different PDFs with two newlines
  } catch (error) {
    console.error('Error reading PDF:', error);
    throw new Error('The file could not be read.');
  }
};

export default readPdf;


