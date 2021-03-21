import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import Header from './content/resume-document/header';

//  Left Column
import ContactDetails from './content/resume-document/left-column/contactDetails';
import Education from './content/resume-document/left-column//education';
import HomeTown from './content/resume-document/left-column/homeTown';
import UsefulLinks from './content/resume-document/left-column/usefulLinks';
import Skills from './content/resume-document/left-column/skills';

//  Right Column
import PersonalProfile from './content/resume-document/right-column/personalProfile';
import Experience from './content/resume-document/right-column/experience';

//import profilePic from '../images/eben-profile.jpg';

import resume_data from '../data/resume';

const theme_color = '#4c6c64';

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  leftColumn: {
    marginLeft: 10,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 0,
    backgroundColor: 'white',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 100,
    borderRight: `1pt solid ${theme_color}`
  },
  rightColumn: {
    marginLeft: 5,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 10,
    paddingLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    flexShrink: 0,
    flexGrow: 4,
    flexBasis: 100,
  },
  header: {
    body: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 100,
      padding: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme_color,
      color: '#ffffff'
    },
    sub: {
      fontSize: 14,
      marginBottom: 4
    },
    main: {
      fontSize: 22,
      marginBottom: 6
    }
  },
  block: {
    title: {
      fontSize: 12,
      marginBottom: 2
    },
    subTitle: {
      fontSize: 10,
      marginBottom: 2
    },
    subTitleDesc: {
      fontSize: 8,
      marginBottom: 2
    },
    p: {
      fontSize: 8,
      lineHeight: 1.15,
      marginBottom: 1
    },
    link: {
      fontSize: 8,
      lineHeight: 1.15,
      marginBottom: 1,
      textDecoration: 'none',
      color: theme_color,
    },
    li: {
      fontSize: 8,
      lineHeight: 1.15
    },
    view: {
      marginBottom: 6
    },
  }
});

const scrubUrl = url => {
  return url
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '');
}

const resume_document = () => <Document>
  <Page size="A4" style={styles.page}>

    <Header
      style={styles.header}
      main_text={resume_data.basics.name}
      sub_text={resume_data.basics.label}
    />

    <View style={styles.sectionContainer}>
      <View style={styles.leftColumn}>
        <ContactDetails
          style={styles.block}
          phone_number={scrubUrl(resume_data.basics.phone)}
          email_address={scrubUrl(resume_data.basics.email)}
        />
        <HomeTown
          style={styles.block}
          location={scrubUrl(resume_data.basics.location)}
        />
        <UsefulLinks
          style={styles.block}
          stack_overflow={scrubUrl(resume_data.basics.social.stackOverflow)}
          github={scrubUrl(resume_data.basics.social.github)}
        />
        <Skills
          style={styles.block}
          skills={resume_data.skills}
        />
        <Education
          style={styles.block}
          education={resume_data.education}
        />
      </View>

      <View style={styles.rightColumn}>
        <PersonalProfile
          style={styles.block}
          about={resume_data.about}
        />
        <Experience
          style={styles.block}
          work={resume_data.work}
        />
      </View>
    </View>
  </Page>
</Document>;

export default resume_document;