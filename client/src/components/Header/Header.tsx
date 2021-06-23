import * as React from 'react';
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  useDisclosure,
  Avatar,
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';

type HeaderProps = {
  [key: string]: any;
};

export const Header = (props: HeaderProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());
  return (
    <>
      <Flex
        boxShadow="lg"
        position="sticky"
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
          <Heading as='h2' size='lg' letterSpacing={'tighter'}>
            Tasks IO
          </Heading>
        </Flex>

        <Box cursor="pointer" display={{ base: 'block', md: 'none' }} onClick={handleToggle}>
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
          <Text>Docs</Text>
          <Text>Examples</Text>
          <Text>Blog</Text>
        </Stack>

        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
          mt={{ base: 4, md: 0 }}
        >
          <Avatar />
        </Box>
      </Flex>
    </>
  );
};
