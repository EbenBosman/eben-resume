import React from 'react';
import { Text, Link, View } from '@react-pdf/renderer';

const contactDetails = ({ style, phone_number, email_address }) => (
	<View wrap={false} style={style.view}>
		<Text style={style.title}>Contact Details</Text>
		<Link style={style.link} src={phone_number}>{phone_number}</Link>
		<Link style={style.link} src={email_address}>{email_address}</Link>
	</View>
);

export default contactDetails;