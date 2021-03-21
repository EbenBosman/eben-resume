import React from 'react';
import { Text, View } from '@react-pdf/renderer';

import random from '../common/random';

const educationItems = ({ style, education }) => (
    <View key={random.number()} wrap={false} style={style.view}>
        <Text style={style.subTitle}>{education.what}</Text>
        <Text style={style.p}>{education.where} ({education.when})</Text>
    </View>
);

const education = ({ style, education }) => (
    <View wrap={false}>
        <Text style={style.title}>Education</Text>
        {
            education.map(education => educationItems({ style, education }))
        }
    </View>
);

export default education;