const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const generateResumeMiddleware = require('../middleware/latex')

// Route to generate resume and download the PDF
router.post('/generate-resume', auth, generateResumeMiddleware, (req, res) => {
    try {
        const pdfFilePath = req.generatedResume.pdfFilePath;

        // Send the generated PDF as a download
        res.download(pdfFilePath, `${req.user.id}_resume.pdf`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error downloading the resume PDF.');
    }
});

module.exports = router;
