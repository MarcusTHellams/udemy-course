import {
	Box,
	Heading,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	Wrap,
	WrapItem,
	Button,
	ButtonGroup,
	Text,
	Icon,
	Container,
	Select,
	Stack,
	FormControl,
	FormHelperText,
	FormLabel,
	VisuallyHidden,
} from '@chakra-ui/react';
import * as React from 'react';
import { User } from '../types/user.type';
import { Layout } from '../components/Layout/Layout';
import { PaginatedResults } from '../types/paginatedResults.type';
import { Column, HeaderGroup, Row } from 'react-table';
import { Paginated } from '@makotot/paginated';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ResponsiveTable } from '../components/ResponsiveTable/ResponsiveTable';
import { DeletionVerification } from '../components/DeletionVerification/DeletionVerification';
import { SearchComponent } from '../components/SearchComponent/SearchComponent';
import { getParsedSearch } from '../utils';
import { userQueryKeys } from '.';
import { useItemListComponent } from '../hooks/useItemListComponent';
import { removeUser } from '../graphql/mutations/user';
import { SetQueryType } from '../types/setQuery.type';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';
import { Link } from 'react-router-dom';
import { Role } from '../types/role.type';
import { userListColumns } from '.';

type UserListComponentProps = {
	paginatedUsers?: PaginatedResults<User>;
	setQuery: SetQueryType;
};

export const UserListComponent = ({
	paginatedUsers = {
		items: [],
		meta: { itemCount: 0, totalItems: 0, totalPages: 0, currentPage: 1 },
	},
	setQuery,
}: UserListComponentProps): JSX.Element => {
	const {
		items,
		meta: { totalPages, currentPage },
	} = paginatedUsers;

	const isAdmin = useIsAdmin();
	const [open, setOpen] = React.useState(false);
	const [currentItem, setCurrentItem] = React.useState<
		string | null | undefined
	>();
	const isLoggedIn = useIsLoggedIn();

	const columns = React.useMemo(() => {
		return userListColumns({
			isAdmin,
			isLoggedIn,
			setCurrentItem,
			setOpen,
		});
	}, [isAdmin, isLoggedIn]);

	const { tableInstance, changeHandler, onClose, onDelete, limitRef } =
		useItemListComponent<User>({
			currentPage,
			totalPages,
			document: removeUser,
			queryKeys: userQueryKeys,
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
			<Layout>
				<Heading size="xl" as="h1" mb="4">
					Users
				</Heading>
				<Container mb="4" maxW="container.sm" centerContent>
					<SearchComponent
						title="User Search"
						descriptionText="Search by username, or email, or by role name"
						searchHandler={changeHandler}
					/>
				</Container>
				<ResponsiveTable
					reactTableProps={getTableProps()}
					tableProps={{ variant: 'simple', colorScheme: 'red' }}
				>
					<Thead>
						{headerGroups.map((headerGroup: HeaderGroup<User>) => {
							return (
								<Tr {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map((column) => {
										return (
											<Th
												{...column.getHeaderProps(
													column.getSortByToggleProps()
												)}
											>
												<Wrap as="div">
													<WrapItem as="div">
														{column.render('Header')}
													</WrapItem>
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
											<Td data-th={cell.column.Header} {...cell.getCellProps()}>
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
			</Layout>
			<DeletionVerification
				alertProps={{
					isCentered: true,
					closeOnOverlayClick: false,
				}}
				{...{ onClose, onDelete }}
				isOpen={open}
				title="Delete User"
				bodyText="Are you sure you want to delete the user?"
			/>
		</>
	);
};
