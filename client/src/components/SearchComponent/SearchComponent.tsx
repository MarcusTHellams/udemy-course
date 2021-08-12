import * as React from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import debounce from 'lodash/debounce';

type SearchComponentProps = {
  descriptionText?: string;
  title?: string;
  searchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SearchComponent = ({
  descriptionText,
  searchHandler,
  title,
}: SearchComponentProps): JSX.Element => {
  const [searchText, setSearchText] = React.useState('');
  const changeHandlerRef = React.useRef(searchHandler);

  const debouncedChangeHandler = React.useMemo(
    () => debounce(changeHandlerRef.current, 300),
    []
  );
  return (
    <>
      <FormControl>
        {!!title && (
          <FormLabel fontWeight='bold' htmlFor='search'>
            {title}
          </FormLabel>
        )}
        <Input
          name='search'
          id='search'
          type='search'
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            debouncedChangeHandler(event);
          }}
        />
        {!!descriptionText && (
          <FormHelperText>{descriptionText}</FormHelperText>
        )}
      </FormControl>
    </>
  );
};
