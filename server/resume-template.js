const fs = require('fs');
const handlebars = require('handlebars');
const pdf = require('html-pdf-node');

module.exports = (req, res) => {
   fs.readFile('./src/data/resume.json', (err, resume_data) => {
      if (err) {
         return res.status(500).send('Error reading resume data');
      }

      fs.readFile('./server/resume-template-components/template.hbs', (err, handlebarsTemplate) => {
         if (err) {
            return res.status(500).send('Error reading template file');
         }

         const source = handlebarsTemplate.toString();

         handlebars.registerHelper('replace', (str, toReplace, replaceWith) => {
            return str ? str.replace(toReplace, replaceWith) : '';
         });

         const template = handlebars.compile(source);
         const htmlString = template(JSON.parse(resume_data));

         const options = {
            format: 'A4',
            printBackground: true
         };

         const file = {
            content: htmlString
         };

         pdf.generatePdf(file, options).then(pdfBuffer => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=result.pdf');
            res.send(pdfBuffer);
         }).catch(error => {
            console.error('Error generating PDF:', error);
            res.status(500).send('Error generating PDF');
         });
      });
   });
};