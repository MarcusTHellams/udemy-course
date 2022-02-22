import { Button, ButtonGroup } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Column, Row } from 'react-table';
import { Task } from "types/task.type";

export const taskListColumns = ({
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
	const cols: Column<Task>[] = [
		{
			Header: 'Task Info',
			columns: [
				{
					Header: 'Title',
					accessor: 'title',
					id: 'task.title',
				},
				{
					Header: 'Description',
					accessor: 'description',
					id: 'task.id',
				},
			],
		},
		{
			Header: 'User',
			columns: [
				{
					Header: 'Username',
					accessor: (originalRow: Task) => {
						if (originalRow?.user) {
							return originalRow.user.username;
						} else {
							return 'None';
						}
					},
				},
				{
					Header: 'Email',
					accessor: (originalRow: Task) => {
						if (originalRow?.user) {
							return originalRow.user.email;
						} else {
							return 'None';
						}
					},
				},
			],
		},
	];
	if (isLoggedIn) {
		cols.push({
			Header: 'Actions',
			id: 'Actions',
			columns: [
				{
					Header: 'Edit/Delete',
					Cell: ({ row }: { row: Row<Task> }) => {
						const { id } = row.original;
						return (
							<ButtonGroup isAttached size="xs">
								<Button
									borderRightRadius={isAdmin ? '0' : ''}
									as={Link}
									to={`tasks/${id}`}
									rounded="full"
									colorScheme="green"
								>
									Edit Task
								</Button>
								{isAdmin && (
									<Button
										borderLeftRadius="0"
										onClick={() => {
											setCurrentItem(id);
											setOpen(true);
										}}
										rounded="full"
										colorScheme="red"
									>
										Delete Task
									</Button>
								)}
							</ButtonGroup>
						);
					},
					id: 'edit/delete',
				},
			],
		});
	}
	return cols;
};
