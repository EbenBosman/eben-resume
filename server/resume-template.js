const fs = require('fs');
const handlebars = require('handlebars');
const pdf = require('html-pdf');

module.exports = (res) => {
   fs.readFile('./src/data/resume.json', (err, resume_data) => {
      if (err) {
         res.send(Promise.reject());
      } else {
         fs.readFile('./server/resume-template-components/template.hbs', (err, handlebarsTemplate) => {
            if (err) {
               res.send(Promise.reject());
            }

            const source = handlebarsTemplate.toString();

            handlebars.registerHelper('replace', (str, toReplace, replaceWith) =>{
               return str ? str.replace(toReplace, replaceWith) : '';
            });

            const template = handlebars.compile(source);
            const htmlString = template(JSON.parse(resume_data));

            const options = {
               "format": "A4"
            };

            pdf.create(htmlString, options).toFile('result.pdf', (err) => {
               if (err) {
                  res.send(Promise.reject());
               }

               res.send(Promise.resolve());
            });
         });
      }
   });
};