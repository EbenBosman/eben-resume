import React, { lazy, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const ProfilePic = lazy(() => import(/* webpackChunkName: "profile-pic" */ './content/side-bar-content/profilePic'));

const SiderBar = ({ basics }) => {
    const [isPdfLoading, setPdfIsLoading] = useState(false);
    const [isPdfIsErrored, setPdfIsErrored] = useState(false);
    const [isMessageSending, setMessageLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [isEmailValid, setEmailValid] = useState(true);
    const [emailInvalidText, setEmailInvalidText] = useState("")
    const [message, setMessage] = useState("");
    const [isMessageValid, setMessageValid] = useState(true);
    const [messageInvalidText, setMessageInvalidText] = useState("")

    const constructResumeFileName = name => {
        const date = new Date();

        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        }).replace(/ /g, ' ')

        return `Resume of ${name} (${formattedDate}).pdf`;
    };

    const createAndDownloadPdf = e => {
        e.preventDefault();
        setPdfIsLoading(true);
        
        axios.post('/pdf-resume', {}, { responseType: 'blob' })
            .then((res) => {
                const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                saveAs(pdfBlob, constructResumeFileName('Eben Bosman'));
                setPdfIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setPdfIsLoading(false);
                setPdfIsErrored(true);
                setTimeout(() => {
                    setPdfIsErrored(false);
                }, 1000);
            });
    };

    const sendMessage = e => {
        e.preventDefault();
        setMessageLoading(true);

        if (!isEmailValid || !isMessageValid)
            return;

        const messageDetails = {
            message,
            email
        };

        axios.post('/message', messageDetails)
            .then(() => {
                setMessageLoading(false);
            })
            .then(() => {
                $('#mailMe').modal('hide');
            });
    };

    const changeEmail = e => {
        const rawEmail = e.target.value;
        setEmail(rawEmail);

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (isTextEmpty(rawEmail)) {
            setEmailValid(false);
            setEmailInvalidText("Please provide an valid address.");
        } else if (!isValidEmail(rawEmail)) {
            setEmailValid(false);
            setEmailInvalidText("Please provide a valid email address.");
        } else {
            setEmailValid(true);
            setEmailInvalidText("");
        }
    };

    const changeMessage = e => {
        const rawMessage = e.target.value;
        setMessage(rawMessage);

        if (isTextEmpty(rawMessage)) {
            setMessageValid(false);
            setMessageInvalidText("Please provide a message of at least 50 characters.");
        } else if (isTextLessThan50(rawMessage)) {
            setMessageValid(false);
            setMessageInvalidText(`The minimum required message length is 50 characters. (${50 - rawMessage.length} to go)`);
        } else {
            setMessageValid(true);
            setMessageInvalidText("");
        }
    };

    const isTextEmpty = text => {
        return text.length === 0 && text === "";
    };

    const isTextLessThan50 = text => {
        return text.length <= 49 && text !== "";
    };

    const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    };

    const clearMessageFields = () => {
        setEmail("");
        setEmailValid(true);
        setEmailInvalidText("");

        setMessage("");
        setMessageValid(true);
        setMessageInvalidText("");

        $('#mailMe').modal('hide');
    };

    return (
        <React.Fragment>
            <div className="col-12 col-md-3 col-xl-2 p-0 bg-dark flex-shrink-1 nav-bar">
                <nav id="sidebar"
                    className="navbar navbar-expand-md navbar-dark bg-none flex-md-column flex-row align-items-center py-2 text-center sticky-top">
                    <ProfilePic />
                    <button className="navbar-toggler border-0 order-1" type="button" data-toggle="collapse" data-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div id="nav" className="collapse navbar-collapse order-last">
                        <ul className="navbar-nav flex-column w-100 justify-content-center">
                            <li className="nav-item">
                                <a rel="noopener" className="nav-link text-white" href="#about">About</a>
                            </li>
                            <li className="nav-item">
                                <a rel="noopener" className="nav-link text-white" href="#certificates">Certificates</a>
                            </li>
                            <li className="nav-item">
                                <a rel="noopener" className="nav-link text-white" href="#experience">Experience</a>
                            </li>
                            <li className="nav-item">
                                <a rel="noopener" className="nav-link text-white" href="#skills">Skills</a>
                            </li>
                        </ul>
                    </div>
                    <ul className="nav justify-content-center">
                        <li className="nav-item">
                            <a rel="noreferrer" href={basics.social.github} className="nav-link text-white px-2 side-bar-link-hide-text" target="_blank" title="Github Profile">Github Profile<i className="fab fa-github fa-lg"></i></a>
                        </li>
                        <li className="nav-item">
                            <a rel="noreferrer" href={basics.social.stackOverflow} className="nav-link text-white px-2 side-bar-link-hide-text" target="_blank" title="Stack Overflow Profile">Stack Overflow Profile<i className="fab fa-stack-overflow fa-lg"></i></a>
                        </li>
                        {/* <li className="nav-item">
                            <button type="button" className="btn btn-link nav-link text-white px-2 side-bar-link-hide-text" data-toggle="modal" data-target="#mailMe">Mail Me<i className="fa fa-envelope fa-lg"></i></button>
                        </li> */}
                        <li className="nav-item">
                            <a rel="noreferrer" href={basics.social.linkedIn} className="nav-link text-white px-2 side-bar-link-hide-text" target="_blank" title="LinkedIn Profile">LinkedIn Profile<i className="fab fa-linkedin fa-lg"></i></a>
                        </li>
                        <li className="nav-item">
                            <a
                                rel="noreferrer"
                                href=""
                                className={`nav-link text-white px-2 side-bar-link-hide-text ${isPdfLoading ? "animate-flicker" : ""}`}
                                onClick={createAndDownloadPdf} title="PDF Resume">
                                PDF Resume<i className={`fa fa-file-pdf fa-lg ${isPdfIsErrored ? "shake" : ""}`} style={{color: isPdfIsErrored ? "red" : ""}}></i>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="modal fade" id="mailMe" tabIndex="-1" role="dialog" aria-labelledby="mailMeModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="mailMeModalLabel">Contact Me</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form noValidate>
                                <div className="form-group">
                                    <label htmlFor="email" className={`col-form-label ${!isEmailValid ? "text-danger" : ""}`}>Your Email Address</label>
                                    <input type="text" className={`form-control ${!isEmailValid ? "is-invalid" : ''}`} id="email" name="email" onChange={changeEmail} value={email}></input>
                                    {!isEmailValid ? <div className="invalid-feedback">{emailInvalidText}</div> : <div></div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message-text" className={`col-form-label ${!isMessageValid ? "text-danger" : ""}`}>Message</label>
                                    <textarea className={`form-control ${!isMessageValid ? "is-invalid" : ''}`} id="message-text" name="message-text" onChange={changeMessage} rows="5" value={message}></textarea>
                                    {!isMessageValid ? <div id="messageValidation" className="invalid-feedback">{messageInvalidText}</div> : <div></div>}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={clearMessageFields}>Close</button>
                            <button type="submit" className="btn btn-primary" onClick={sendMessage} disabled={isTextEmpty(message) || isTextEmpty(email) || !isValidEmail(email) || isTextLessThan50(message)}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SiderBar;