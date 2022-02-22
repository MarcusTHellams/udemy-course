import {
	Box,
	Button,
	ButtonGroup,
	FormControl,
	FormHelperText,
	FormLabel,
	Icon,
	Select,
	Stack,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	VisuallyHidden,
	Wrap,
	WrapItem,
	Text,
	Container,
} from '@chakra-ui/react';
import { Paginated } from '@makotot/paginated';
import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getParsedSearch } from "utils";
import {
  HeaderGroup,
  Row,
  TablePropGetter,
  TableProps,
  TableBodyPropGetter,
  TableBodyProps,
} from "react-table";
import { SetQueryType } from "types/setQuery.type";
import {
  SearchComponent,
  SearchComponentProps,
} from "components/SearchComponent/SearchComponent";
import { ResponsiveTable } from "components/ResponsiveTable/ResponsiveTable";

interface TableComponentProps<T extends object> extends SearchComponentProps {
	setQuery: SetQueryType;
	page: Row<T>[];
	getTableProps: (propGetter?: TablePropGetter<T> | undefined) => TableProps;
	getTableBodyProps: (
		propGetter?: TableBodyPropGetter<T> | undefined
	) => TableBodyProps;
	headerGroups: HeaderGroup<T>[];
	prepareRow: (row: Row<T>) => void;
	totalPages: number;
	currentPage: number;
	limitRef: React.MutableRefObject<HTMLSelectElement | null>;
}

export const TableComponent = <T extends object>({
	currentPage,
	getTableBodyProps,
	getTableProps,
	headerGroups,
	limitRef,
	page,
	prepareRow,
	setQuery,
	totalPages,
	title,
	descriptionText,
	searchHandler,
}: TableComponentProps<T>) => {
	return (
		<>
			<Container mb="4" maxW="container.sm" centerContent>
				<SearchComponent {...{ searchHandler, title, descriptionText }} />
			</Container>
			<ResponsiveTable
				reactTableProps={getTableProps()}
				tableProps={{ variant: 'simple', colorScheme: 'red' }}
			>
				<Thead>
					{headerGroups.map((headerGroup: HeaderGroup<T>) => {
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
                        className='mobile-header'
                        fontWeight='bold'
                        as='span'
                      >
                        {cell.column.isSorted ? (
                          cell.column.isSortedDesc ? (
                            <React.Fragment>
                              <Icon as={FaChevronDown} w={4} h={4} />{" "}
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <Icon as={FaChevronUp} w={4} h={4} />{" "}
                            </React.Fragment>
                          )
                        ) : (
                          ""
                        )}{" "}
                        {cell.column.Header}:
                      </Text>
                      {cell.render("Cell")}
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
		</>
	);
};
