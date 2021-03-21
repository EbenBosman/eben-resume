import React from 'react';
import { Link, Text, View } from '@react-pdf/renderer';

import random from '../common/random';

const listItem = ({ style, highlight }) => (
    <Text key={random.number()} style={style.li}>{`•   ${highlight}`}</Text>
);

const jobLink = ({ style, website, company }) => (
    <Link style={style.link} src={website}>{company}</Link>
)

{/* Note social style... */ }
const experienceItem = ({ style, job }) => (
    <View key={random.number()} wrap={false} style={style.view}>
        <Text style={style.subTitle}>{job.position}<Text style={style.p}> at </Text>{jobLink({ style, website: job.website, company: job.company })}</Text>
        <Text style={style.subTitleDesc}>{job.startDate} - {job.endDate}</Text>
        <Text style={style.subTitleDesc}>{job.location}</Text>
        <Text style={style.p}>{job.summary}</Text>
        {
            job.highlights.map(highlight => listItem({ style, highlight }))
        }
    </View>
);

const experience = ({ style, work }) => (
    <View wrap={false}>
        <Text style={style.title}>Experience</Text>
        {
            work.map(job => experienceItem({ style, job }))
        }
    </View>
);

export default experience;