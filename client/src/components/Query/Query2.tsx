/* eslint-disable react/jsx-pascal-case */
import {
	Spinner,
	SpinnerProps,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';
import * as React from 'react';
import { Chakra_UI_Backdrop } from 'chakra-ui-backdrop';
import { Layout } from '../Layout/Layout';

interface QueryProps {
	isLoading: boolean;
	error?: string;
	spinnerProps?: SpinnerProps;
}

export function Query({
	isLoading,
	children,
	error,
	spinnerProps,
}: React.PropsWithChildren<QueryProps>): JSX.Element {
	if (isLoading) {
		return (
			<Chakra_UI_Backdrop isOpen={true}>
				<Spinner size="xl" {...spinnerProps} />
			</Chakra_UI_Backdrop>
		);
	}

	if (error) {
		return (
			<Layout>
				<Alert status="error">
					<AlertIcon />
					<AlertTitle mr={2}>There is a problem</AlertTitle>
					<AlertDescription>{error.split(':')[0]}</AlertDescription>
				</Alert>
			</Layout>
		);
	}

	return <>{children}</>;
}
