import {
	Avatar,
	Badge,
	Button,
	ButtonGroup,
	HStack,
	Link,
	Text,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import React from 'react';
import { Column, Row } from 'react-table';
import { Role } from '../types/role.type';
import { User } from '../types/user.type';

export const userListColumns = ({
	isAdmin,
	isLoggedIn,
	setOpen,
	setCurrentItem,
}: {
	isAdmin: boolean;
	isLoggedIn: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setCurrentItem: React.Dispatch<
		React.SetStateAction<string | null | undefined>
	>;
}) => {
	const cols: Column<User>[] = [
		{
			Header: 'Username',
			accessor: 'username',
			id: 'user.username',
			Cell: ({ row }) => {
				const { username, imageUrl } = row.original;
				return (
					<>
						<HStack>
							<Avatar size="sm" name={username} src={imageUrl} />
							<Text wordBreak="break-all">{username}</Text>
						</HStack>
					</>
				);
			},
		},
		{
			Header: 'Email',
			accessor: 'email',
			id: 'user.email',
		},
		{
			Header: 'Roles',
			Cell: ({ row }: { row: Row<User> }) => {
				const { roles } = row.original;
				return (
					<>
						<Wrap>
							{(!!roles &&
								roles.map((role: Role) => {
									return (
										<React.Fragment key={role.id}>
											<WrapItem>
												<Badge rounded="full">{role.name}</Badge>
											</WrapItem>
										</React.Fragment>
									);
								})) || <Text>None</Text>}
						</Wrap>
					</>
				);
			},
		},
	];

	if (isLoggedIn) {
		cols.push({
			Header: 'Actions',
			id: 'actions',
			Cell: ({ row }: { row: Row<User> }) => {
				const { id } = row.original;
				return (
					<ButtonGroup isAttached size="xs">
						<Button
							borderRightRadius={isAdmin ? '0' : ''}
							as={Link}
							to={`users/${id}`}
							rounded="full"
							colorScheme="green"
						>
							Edit User
						</Button>
						{isAdmin && (
							<Button
								onClick={() => {
									setCurrentItem(id);
									setOpen(true);
								}}
								borderLeftRadius="0"
								rounded="full"
								colorScheme="red"
							>
								Delete User
							</Button>
						)}
					</ButtonGroup>
				);
			},
		});
	}

	return cols;
};
