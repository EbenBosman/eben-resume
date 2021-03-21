import React from 'react';
import { Text, View } from '@react-pdf/renderer';

const homeTown = ({ style, location }) => (
    <View wrap={false} style={style.view}>
        <Text style={style.title}>Hometown</Text>
        <Text style={style.p}>{location}</Text>
    </View>
);

export default homeTown;