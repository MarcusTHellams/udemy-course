import * as React from 'react';
import {
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { useDebounce, usePrevious } from 'react-use';
import { getParsedSearch } from '../../utils';
import { useHistory } from 'react-router-dom';

type SearchComponentProps = {
	descriptionText?: string;
	title?: string;
	searchHandler: (searchTerm: string) => void;
};

export const SearchComponent = ({
	descriptionText,
	searchHandler,
	title,
}: SearchComponentProps): JSX.Element => {
	const [forceUpdate, setForceUpdate] = React.useState(false);
	const searchRef = React.useRef<HTMLInputElement | null>(null);
	const history = useHistory();

	const prevSearchText = usePrevious(searchRef.current?.value);

	const flag = React.useRef(false);
	useDebounce(
		() => {
			if (!flag.current) {
				flag.current = true;
				return;
			}
			if (searchRef.current) {
				// if (!prevSearchText || prevSearchText === searchRef.current.value) {
				// 	return;
				// }
				searchHandler(searchRef.current.value);
			}
		},
		500,
		[forceUpdate]
	);

	React.useEffect(() => {
		const unListen = history.listen(() => {
			const { search } = getParsedSearch();
			if (search) {
				if (searchRef.current) {
					searchRef.current.value = search as string;
				}
			}

			if (!search) {
				if (searchRef.current) {
					searchRef.current.value = '';
				}
			}
		});

		return () => {
			unListen();
		};
	}, [history]);

	return (
		<>
			<FormControl>
				{!!title && (
					<FormLabel fontWeight="bold" htmlFor="search">
						{title}
					</FormLabel>
				)}
				<Input
					ref={searchRef}
					name="search"
					id="search"
					type="search"
					defaultValue={(getParsedSearch().search as string) || ''}
					onInput={(event) => {
						if (searchRef.current) {
							searchRef.current.value = event.currentTarget.value;
							setForceUpdate((prev) => !prev);
						}
					}}
				/>
				{!!descriptionText && (
					<FormHelperText>{descriptionText}</FormHelperText>
				)}
			</FormControl>
		</>
	);
};
