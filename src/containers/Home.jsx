import React from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import SiderBar from '../components/siderbar';
import Content from '../components/content';
import resume from '../data/resume';

class Home extends React.Component {
    // renderHTMLtoPDF = () => {
    //     //const body = this.generateHome(true);

    //     html2canvas(document.getElementById('resume'))
    //         .then(canvas => {
    //             const contentWidth = canvas.width;
    //             const contentHeight = canvas.height;

    //             //One page pdf shows the canvas height generated by html page
    //             let pageHeight = contentWidth / 592.28 * 841.89;

    //             //Html page height without pdf generated
    //             let leftHeight = contentHeight;

    //             //Page offset
    //             let position = 0;

    //             //The size of a4 paper [595.28,841.89], the width and height of the canvas generated in the html page in the pdf
    //             const imgWidth = 595.28;
    //             const imgHeight = 592.28 / contentWidth * contentHeight;

    //             const pageData = canvas.toDataURL('image/jpeg', 1.0);

    //             const pdf = new jsPDF('', 'pt', 'a4');

    //             //There are two heights that need to be distinguished, one is the actual height of the html page, and the page height of the generated pdf (841.89)
    //             //When the content does not exceed the range of one page of pdf, no pagination is required
    //             if (leftHeight < pageHeight) {
    //                 pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    //             } else {
    //                 while (leftHeight > 0) {
    //                     pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
    //                     leftHeight -= pageHeight;
    //                     position -= 841.89;

    //                     //Avoid adding blank pages
    //                     if (leftHeight > 0) {
    //                         pdf.addPage();
    //                     }
    //                 }
    //             }

    //             pdf.save('Eben Bosman - Resume.pdf');
    //         });
    // }

    render() {        
        return <div className="container-fluid">
            <div className="row min-vh-100 flex-column flex-md-row">
                <SiderBar {...resume} hideReferences={true} />
                <Content {...resume} hideReferences={true} renderHTMLtoPDF={this.renderHTMLtoPDF} />
            </div>
        </div>;
    }
}

export default Home;
