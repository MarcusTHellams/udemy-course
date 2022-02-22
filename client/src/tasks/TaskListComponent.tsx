import * as React from 'react';
import { Task } from "types/task.type";
import { Button, Heading } from "@chakra-ui/react";
import { Link as RLink } from "react-router-dom";
import { DeletionVerification } from "components/DeletionVerification/DeletionVerification";
import { removeTask } from "graphql/mutations/removeTask";
import { PaginatedResults } from "types/paginatedResults.type";
import { useIsLoggedIn } from "hooks/useIsLoggedIn";
import { useIsAdmin } from "hooks/useIsAdmin";
import { SetQueryType } from "types/setQuery.type";
import { useItemListComponent } from "hooks/useItemListComponent";
import { taskQueryKeys } from "queryKeys/taskQueryKeys";
import { taskListColumns } from ".";
import { TableComponent } from "components/TableComponent/TableComponent";

type TaskListComponentProps = {
	paginatedTasks?: PaginatedResults<Task>;
	setQuery: SetQueryType;
};

export const TaskListComponent = ({
	paginatedTasks = {
		items: [],
		meta: { itemCount: 0, totalItems: 0, totalPages: 0, currentPage: 1 },
	},
	setQuery,
}: TaskListComponentProps): JSX.Element => {
	const {
		items,
		meta: { totalPages, currentPage },
	} = paginatedTasks;
	const [open, setOpen] = React.useState(false);
	const [currentItem, setCurrentItem] = React.useState<
		string | null | undefined
	>();
	const isLoggedIn = useIsLoggedIn();
	const isAdmin = useIsAdmin();

	const columns = React.useMemo(() => {
		return taskListColumns({
			isAdmin,
			isLoggedIn,
			setOpen,
			setCurrentItem,
		});
	}, [isAdmin, isLoggedIn]);

	const { tableInstance, changeHandler, onClose, onDelete, limitRef } =
		useItemListComponent({
			currentPage,
			totalPages,
			document: removeTask,
			queryKeys: taskQueryKeys,
			setQuery,
			items,
			columns,
			setOpen,
			open,
			setCurrentItem,
			currentItem,
		});

	const { getTableProps, headerGroups, getTableBodyProps, page, prepareRow } =
		tableInstance;

	return (
		<>
			<Heading
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				as="h1"
				mb="8"
			>
				Tasks
				<Button
					as={RLink}
					to="/tasks/create"
					colorScheme="green"
					rounded="full"
				>
					New Task
				</Button>
			</Heading>
			<TableComponent<Task>
				title="Task Search"
				descriptionText="Search by title, description, username, and email"
				searchHandler={changeHandler}
				{...{
					getTableProps,
					headerGroups,
					getTableBodyProps,
					page,
					prepareRow,
					totalPages,
					currentPage,
					limitRef,
					setQuery,
				}}
			/>

			<DeletionVerification
				alertProps={{
					isCentered: true,
					closeOnOverlayClick: false,
				}}
				isOpen={open}
				{...{ onClose, onDelete }}
				title="Delete Task"
				bodyText="Are you sure you want to delete the task?"
			/>
		</>
	);
};
