import React from 'react';
import { Text, View } from '@react-pdf/renderer';

const header = ({ style, main_text, sub_text }) => (
    <View style={style.body}>
        <Text style={style.main}>{main_text}</Text>
        <Text style={style.sub}>{sub_text}</Text>
    </View>
);

export default header;