import * as React from 'react';
import {
  Heading,
  Avatar,
  Box,
  Text,
  Stack,
  Button,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { User } from '../../types/user.type';

type CardProps = {
  [key: string]: any;
  user: User;
};

export const Card = ({ user, ...rest }: CardProps): JSX.Element => {
  return (
    <>
      <Box
        {...rest}
        maxW={'320px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        mr="0.9375rem"
        ml="0.9375rem"
        mb="0.9375rem"
        textAlign={'center'}
      >
        <Avatar
          size={'xl'}
          alt={'Avatar Alt'}
          mb={4}
          pos={'relative'}
          name={user.username}
        />
        <Heading fontSize={'2xl'} fontFamily={'body'}>
          {user.username}
        </Heading>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
          {user.email}
        </Text>

        {!!user.roles && (
          <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
            {user.roles.map((role) => {
              return (
                <React.Fragment key={role.id}>
                  <Badge borderRadius="full" px={2} py={1} bg={'gray.300'} fontWeight={'400'}>
                    {role.name}
                  </Badge>
                </React.Fragment>
              );
            })}
          </Stack>
        )}

        <Stack mt={8} direction={'row'} spacing={4}>
          <Button
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            _focus={{
              bg: 'gray.200',
            }}
          >
            View
          </Button>
          <Button
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            bg={'blue.400'}
            color={'white'}
            boxShadow={
              '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
            }
            _hover={{
              bg: 'blue.500',
            }}
            _focus={{
              bg: 'blue.500',
            }}
          >
            Edit
          </Button>
        </Stack>
      </Box>
    </>
  );
};
