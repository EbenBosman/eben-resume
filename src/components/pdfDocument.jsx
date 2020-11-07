import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';

import profilePic from '../images/eben-profile.jpg';

import resume from '../data/resume';

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  leftSection: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 0,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 0,
    backgroundColor: 'white',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 100,
    borderRight: '1pt solid #388bff'
  },
  rightSection: {
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 10,
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
  heading: {
    body: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 100,
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 0,
      marginRight: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    small: {
      fontSize: 14,
      marginBottom: 4
    },
    big: {
      fontSize: 22,
      marginBottom: 6
    }
  },
  title: {
    fontSize: 12,
    marginBottom: 6
  },
  subTitle: {
    fontSize: 10,
    marginBottom: 4
  },
  p: {
    fontSize: 8,
    marginBottom: 2
  },
  profilePicture: {
    width: '155px',
    marginBottom: 5
  },
  social: {
    marginBottom: 5
  }
});

const scrubUrl = url => {
  return url
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '');
}

// Create Document Component
const MyDocument = () => <Document>
  <Page size="A4" style={styles.page}>
    <View style={styles.heading.body}>
      <Text style={styles.heading.big}>{resume.basics.name}</Text>
      <Text style={styles.heading.small}>{resume.basics.label}</Text>
    </View>
    <View style={styles.sectionContainer}>
      <View style={styles.leftSection}>
        {/*<Image source={profilePic} style={styles.profilePicture} />*/}
        <View wrap={false} style={styles.social}>
          <Text style={styles.title}>Contact Details</Text>
          <Text style={styles.p}>{scrubUrl(resume.basics.phone)}</Text>
          <Link style={styles.p}>{scrubUrl(resume.basics.email)}</Link>

          <Text style={styles.title}>Hometown</Text>
          <Text style={styles.p}>{scrubUrl(resume.basics.location)}</Text>

          <Text style={styles.title}>Useful Links</Text>
          <Link style={styles.p}>ebenbosman.com</Link>
          <Link style={styles.p}>{scrubUrl(resume.basics.social.stackOverflow)}</Link>
          <Link style={styles.p}>{scrubUrl(resume.basics.social.github)}</Link>
        </View>
        <View wrap={false} style={styles.social}>
          {
            resume.skills.map((skill, skillKey) => {
              return <View wrap={false} style={styles.social}>
                <Text key={skillKey} style={styles.title}>{skill.Title}</Text>
                {
                  skill.Items.map((type, key) => <Text key={key} style={styles.p}>{type}</Text>)
                }
              </View>;
            })
          }
        </View>
        <View wrap={false} style={styles.social}>
          <Text style={styles.title}>Education</Text>
          {
            resume.education.map((ed, key) => {
              return <View wrap={false} style={styles.social}>
                <Text key={key} style={styles.title}>{ed.what}</Text>
                <Text key={key} style={styles.p}>{ed.where} ({ed.when})</Text>
              </View>;
            })
          }
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.title}>Personal Profile</Text>
        {
          resume.about.map((line, key) => <Text key={key} style={styles.p}>{line}</Text>)
        }
        <Text style={styles.title}>Experience</Text>
        {
          resume.work.map(
            (xp, key) => <View key={key} wrap={false}>
              <Text style={styles.subTitle}>{xp.company}</Text>
              <Text style={styles.p}>{xp.summary}</Text>
              {xp.highlights.map(h => <Text style={styles.p}>{h}</Text>)}
            </View>
          )
        }
      </View>
    </View>
  </Page>
</Document>;

export default MyDocument;