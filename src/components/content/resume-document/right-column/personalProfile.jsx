import React from 'react';
import { Text, View } from '@react-pdf/renderer';

import random from '../common/random';

const paragraph = ({ style, line }) => (
    <Text key={random.number()} style={style.p}>{line}</Text>
);

const personal_profile = ({ style, about }) => (
    <View wrap={false} style={style.view}>
        <Text style={style.title}>Personal Profile</Text>
        {
            about.map(line => paragraph({ style, line }))
        }
    </View>
);

export default personal_profile;