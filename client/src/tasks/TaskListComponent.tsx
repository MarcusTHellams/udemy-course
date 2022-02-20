import * as React from 'react';
import { Task } from '../types/task.type';
import {
	Button,
	Text,
	Heading,
	ButtonGroup,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Box,
	Wrap,
	WrapItem,
	Icon,
	Container,
	Stack,
	FormControl,
	VisuallyHidden,
	FormLabel,
	FormHelperText,
	Select,
} from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';
import { DeletionVerification } from '../components/DeletionVerification/DeletionVerification';
import { removeTask } from '../graphql/mutations/removeTask';
import { PaginatedResults } from '../types/paginatedResults.type';
import { HeaderGroup } from 'react-table';
import { Paginated } from '@makotot/paginated';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ResponsiveTable } from '../components/ResponsiveTable/ResponsiveTable';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { SearchComponent } from '../components/SearchComponent/SearchComponent';
import { SetQueryType } from '../types/setQuery.type';
import { useItemListComponent } from '../hooks/useItemListComponent';
import { taskQueryKeys } from '../queryKeys/taskQueryKeys';
import { getParsedSearch } from '../utils';
import { taskListColumns } from '.';

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
			<Container mb="4" maxW="container.sm" centerContent>
				<SearchComponent
					title="Task Search"
					descriptionText="Search by title, description, username, and email"
					searchHandler={changeHandler}
				/>
			</Container>
			<ResponsiveTable
				reactTableProps={getTableProps()}
				tableProps={{ variant: 'simple', colorScheme: 'red' }}
			>
				<Thead>
					{headerGroups.map((headerGroup: HeaderGroup<Task>) => {
						return (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => {
									return (
										<Th
											{...column.getHeaderProps(column.getSortByToggleProps())}
										>
											<Wrap as="div">
												<WrapItem as="div">{column.render('Header')}</WrapItem>
												<WrapItem as="div">
													{column.isSorted ? (
														column.isSortedDesc ? (
															<Icon as={FaChevronDown} w={4} h={4} />
														) : (
															<Icon as={FaChevronUp} w={4} h={4} />
														)
													) : (
														''
													)}
												</WrapItem>
											</Wrap>
										</Th>
									);
								})}
							</Tr>
						);
					})}
				</Thead>
				<Tbody {...getTableBodyProps()}>
					{page.map((row) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()}>
								{row.cells.map((cell) => {
									return (
										<Td {...cell.getCellProps()}>
											<Text
												{...cell.column.getHeaderProps(
													cell.column.getSortByToggleProps()
												)}
												className="mobile-header"
												fontWeight="bold"
												as="span"
											>
												{cell.column.Header}:
												{cell.column.isSorted ? (
													cell.column.isSortedDesc ? (
														<Icon as={FaChevronDown} w={4} h={4} />
													) : (
														<Icon as={FaChevronUp} w={4} h={4} />
													)
												) : (
													''
												)}
											</Text>
											{cell.render('Cell')}
										</Td>
									);
								})}
							</Tr>
						);
					})}
				</Tbody>
			</ResponsiveTable>
			<Stack
				direction={['column', null, 'row']}
				spacing={'6'}
				my={'8'}
				alignItems={'flex-end'}
			>
				{totalPages > 1 && (
					<Box display={['none', null, null, 'block']}>
						<Paginated
							currentPage={currentPage}
							totalPage={totalPages}
							siblingsSize={2}
							boundarySize={2}
						>
							{({
								pages,
								currentPage,
								hasPrev,
								hasNext,
								getFirstBoundary,
								getLastBoundary,
								isPrevTruncated,
								isNextTruncated,
							}) => (
								<ButtonGroup
									flexWrap="nowrap"
									mt="5"
									colorScheme="red"
									variant="outline"
									isAttached={true}
								>
									{hasPrev() && (
										<>
											<Button onClick={() => setQuery({ page: 1 })}>
												First
											</Button>
											<Button
												onClick={() => setQuery({ page: currentPage - 1 })}
											>
												Prev
											</Button>
										</>
									)}
									{getFirstBoundary().map((boundary) => (
										<Button
											onClick={() => setQuery({ page: boundary })}
											key={boundary}
										>
											{boundary}
										</Button>
									))}
									{isPrevTruncated && <Button>...</Button>}
									{pages.map((page) => {
										return page === currentPage ? (
											<Button variant="solid" disabled={true} key={page}>
												{page}
											</Button>
										) : (
											<Button
												onClick={() => {
													setQuery({ page });
												}}
												key={page}
											>
												{page}
											</Button>
										);
									})}
									{isNextTruncated && <Button>...</Button>}
									{getLastBoundary().map((boundary) => (
										<Button
											onClick={() => setQuery({ page: boundary })}
											key={boundary}
										>
											{boundary}
										</Button>
									))}
									{hasNext() && (
										<>
											<Button
												onClick={() => {
													setQuery({ page: currentPage + 1 });
												}}
											>
												Next
											</Button>
											<Button onClick={() => setQuery({ page: totalPages })}>
												Last
											</Button>
										</>
									)}
								</ButtonGroup>
							)}
						</Paginated>
					</Box>
				)}
				<FormControl display={['block', null, null, 'none']}>
					<VisuallyHidden>
						<FormLabel htmlFor="selectPage">Choose a Page Size</FormLabel>
					</VisuallyHidden>
					<FormHelperText>Choose a Page</FormHelperText>
					<Select
						id="selectPage"
						name="selectPage"
						variant={'flushed'}
						onChange={(event) => {
							setQuery({ page: parseInt(event.currentTarget.value, 10) });
						}}
						value={currentPage}
					>
						{new Array(totalPages).fill(1).map((_, index) => {
							return (
								<option value={index + 1} key={index}>
									{index + 1}
								</option>
							);
						})}
					</Select>
				</FormControl>

				<FormControl>
					<VisuallyHidden>
						<FormLabel htmlFor="pageSize">Choose a Page Size</FormLabel>
					</VisuallyHidden>
					<FormHelperText>Choose a Page Size</FormHelperText>
					<Select
						id="pageSize"
						name="pageSize"
						variant={'flushed'}
						ref={limitRef}
						size="sm"
						onInput={(event) => {
							setQuery({ limit: parseInt(event.currentTarget.value, 10) });
						}}
						defaultValue={(getParsedSearch().limit as string) || 10}
					>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</Select>
				</FormControl>
			</Stack>

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
