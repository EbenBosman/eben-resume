import React from 'react'
import classNames from 'classnames'

class Navbar extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            isOpen: false,
        }
    }

    handleClick = e => {
        const { isOpen } = this.state
        this.setState({
            isOpen: !isOpen,
        })
    }

    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            const anchorElement = document.getElementById(anchorName)
            if(anchorElement) {
                anchorElement.scrollIntoView()
                this.setState({
                    isOpen: false,
                })
            }
        }
    }

    render () {
        const { isOpen } = this.state
        const btnClass = classNames({
            'js-floating-nav-trigger': true,
            'floating-nav-trigger': true,
            'is-open': isOpen,
        })
        const navcls = classNames({
            'floating-nav': true,
            'js-floating-nav': true,
            'is-visible': isOpen,
        })

        return (
            <section className="col-md-12 nav-card-wrapper">
                <a className={btnClass} href="javascript:;" onClick={this.handleClick}>
                    <i className="icon-bars"></i>
                    <span className="close-icon">×</span>
                </a>
                <a className={btnClass} href="javascript:;" onClick={this.props.renderHTMLtoPDF} style={{ bottom: '80px' }}>
                    <i className="glyphicon glyphicon-download-alt" style={{ lineHeight: '50px' }}></i>
                </a>
                <nav className={navcls}>
                    <ul className="list-unstyled">
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('about')}><i className="mr-10 icon-board"></i>About Me</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('work-experience')}><i className="mr-10 icon-office"></i>Experience</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('education')}><i className="mr-10 icon-graduation-cap"></i>Education &amp; Certificates</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('skills')}><i className="mr-10 icon-tools"></i>Skills</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('references')}><i className="mr-10 icon-thumbs-up"></i>References</a></li>
                    </ul>
                </nav>
            </section>
        )
    }
}

export default Navbar
