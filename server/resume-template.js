const fs = require('fs');
const handlebars = require('handlebars');
const pdf = require('html-pdf');

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
            "format": "A4"
         };
         
         // There exists an issue that if zoom is not applied to the html (inside the doc's style tag),
         // then all content is rendered too large.
         // https://github.com/marcbachmann/node-html-pdf/issues/110
         pdf.create(htmlString, options).toStream((err, stream) => {
            if (err) {
               return res.status(500).send('Error creating PDF');
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=result.pdf');
            stream.pipe(res);  // Stream the PDF data to the response object
         });
      });
   });
};