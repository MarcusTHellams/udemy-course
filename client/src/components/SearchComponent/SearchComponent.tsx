import * as React from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useDebounce } from 'react-use';

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
  const [searchText, setSearchText] = React.useState('');

  useDebounce(
    () => {
      searchHandler(searchText);
    },
    500,
    [searchText]
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
          }}
        />
        {!!descriptionText && (
          <FormHelperText>{descriptionText}</FormHelperText>
        )}
      </FormControl>
    </>
  );
};
