import * as React from 'react';
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  useDisclosure,
  Avatar,
  Link,
  Button,
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link as RLink } from 'react-router-dom';
import { useUserContext } from '../../contexts/userContext/userContext';

type HeaderProps = {
  [key: string]: any;
};

export const Header = (props: HeaderProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());
  const { userStorage } = useUserContext();
  const user = JSON.parse(userStorage as string);
  return (
    <>
      <Flex
        boxShadow='lg'
        position='sticky'
        as='nav'
        align='center'
        justify='space-between'
        wrap='wrap'
        padding={6}
        bg='red.800'
        color='white'
        {...props}
      >
        <Flex align='center' mr={5}>
          <Heading as='h6' size='md' letterSpacing={'tighter'}>
            <Link _hover={{ textDecoration: 'none' }} as={RLink} to='/'>
              Tasks IO
            </Link>
          </Heading>
        </Flex>

        <Box
          cursor='pointer'
          display={{ base: 'block', md: 'none' }}
          onClick={handleToggle}
        >
          <GiHamburgerMenu />
        </Box>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems='center'
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          <Text>
            <Link as={RLink} to='/users'>
              Users
            </Link>
          </Text>
          <Text>Examples</Text>
          <Text>Blog</Text>
        </Stack>

        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
          mt={{ base: 4, md: 0 }}
        >
          {(user && (
            <Avatar src={user.imageUrl} size='md' name={user.username} />
          )) || (
            <Button size='xs' as={RLink} to='/login' variant='outline'>
              Log In
            </Button>
          )}
        </Box>
      </Flex>
    </>
  );
};
