const fs = require('fs');
const handlebars = require('handlebars');
const pdf = require('html-pdf');

module.exports = (res) => {
   fs.readFile('./src/data/resume.json', (err, resume_data) => {
      console.log('resume-template enter', resume_data)
      if (err) {
         console.log('resume-template error', err)
         res.send(Promise.reject());
      } else {
         console.log('resume-template 1')
         fs.readFile('./server/resume-template-components/template.hbs', (err, handlebarsTemplate) => {
            if (err) {
               console.log('resume-template 1 error', err)
               res.send(Promise.reject());
            }

            const source = handlebarsTemplate.toString();
            console.log('resume-template 2 source', source)

            handlebars.registerHelper('replace', (str, toReplace, replaceWith) =>{
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