import React from 'react';
import { Text, Link, View } from '@react-pdf/renderer';

const usefulLinks = ({ style, stack_overflow, github }) => (
    <View wrap={false} style={style.view}>
        <Text style={style.title}>Useful Links</Text>
        <Link style={style.link} src="ebenbosman.com">ebenbosman.com</Link>
        <Link style={style.link} src={stack_overflow}>{stack_overflow}</Link>
        <Link style={style.link} src={github}>{github}</Link>
    </View>
);

export default usefulLinks;