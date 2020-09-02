import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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
    marginTop: 0,
    marginBottom: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: 'blue',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 100,
  },
  rightSection: {
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: 'white',
    padding: 5,
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
  }
});

// Create Document Component
const MyDocument = () => <Document>
  <Page size="A4" style={styles.page}>
    <View style={styles.heading.body}>
      <Text style={styles.heading.small}>Resume of</Text>
      <Text style={styles.heading.big}>{resume.basics.name}</Text>
      <Text style={styles.heading.small}>for the position of {resume.basics.position}</Text>
    </View>
    <View style={styles.sectionContainer}>
      <View style={styles.leftSection}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.title}>About me</Text>
        {
          resume.about.map(line => <Text style={styles.p}>{line}</Text>)
        }
        <Text style={styles.title}>Work Experience</Text>
        {
          resume.work.map(
            xp => <View wrap={false}>
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