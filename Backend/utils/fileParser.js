const pdf = require('pdf-parse');
const docxParser = require('docx-parser');
const fs = require('fs');
const path = require('path');

const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

const parseDOCX = (filePath) => {
  return new Promise((resolve, reject) => {
    docxParser.parseDocx(filePath, (err, text) => {
      if (err) return reject(err);
      resolve(text);
    });
  });
};

const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.pdf':
      return await parsePDF(filePath);
    case '.docx':
      return await parseDOCX(filePath);
    default:
      throw new Error('Unsupported file type');
  }
};

module.exports = extractTextFromFile;
