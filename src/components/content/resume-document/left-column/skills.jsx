import React from 'react';
import { Text, View } from '@react-pdf/renderer';

import random from '../common/random';

const paragraph = ({ style, skill_type }) => (
    <Text key={random.number()} style={style.p}>{skill_type}</Text>
);

const skillItems = ({ style, skill }) => (
    <View key={random.number()} wrap={false} style={style.view}>
        <Text style={style.subTitle}>{skill.Title}</Text>
        {
            skill.Items.map(skill_type => paragraph({ style, skill_type }))
        }
    </View>
);

const skills = ({ style, skills }) => (
    <View wrap={false}>
        <Text style={style.title}>Skills</Text>
        {
            skills.map(skill => skillItems({ style, skill }))
        }
    </View>
);

export default skills;