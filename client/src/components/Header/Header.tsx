import * as React from "react";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link as RLink, useHistory } from "react-router-dom";
import { useUserContext } from "../../contexts/userContext/userContext";
import { Rclient } from "../../graphql/client";
import { logout } from "../../graphql/mutations/logout";
import { useMutation } from "react-query";

type HeaderProps = {
  [key: string]: any;
};

const mutationFn = (): Promise<string> => {
  return Rclient.request(logout).then(({ logout }) => logout);
};

export const Header = (props: HeaderProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
	const handleToggle = () => (isOpen ? onClose() : onOpen());
	const { userStorage, removeUserStorage } = useUserContext();
	const [user, setUser] = React.useState<{
		username: string;
		imageUrl?: string;
		id: string;
	} | null>(null);

	const history = useHistory();

	const { mutate } = useMutation<string, Error>(mutationFn, {
		onSuccess() {
			removeUserStorage();
			history.push('/login');
		},
	});

	React.useEffect(() => {
		const unListen = history.listen(() => {
			onClose();
		});

		return () => {
			unListen();
		};
	}, [history, onClose]);


  React.useEffect(() => {
    if (userStorage) {
      setUser(JSON.parse(userStorage));
    } else {
      setUser(null);
    }
  }, [userStorage]);

  return (
    <>
      <Flex
        boxShadow="lg"
        position="sticky"
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={6}
        bg="red.800"
        color="white"
        top="0"
        zIndex="sticky"
        {...props}
      >
        <Flex align="center" mr={5}>
          <Heading as="h6" size="md" letterSpacing={'tighter'}>
            <Link _hover={{ textDecoration: 'none' }} as={RLink} to="/">
              Tasks IO
            </Link>
          </Heading>
        </Flex>

        <Box
          cursor="pointer"
          display={{ base: 'block', md: 'none' }}
          onClick={handleToggle}
        >
          <GiHamburgerMenu />
        </Box>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          <Text>
            <Link as={RLink} to="/users">
              Users
            </Link>
          </Text>
        </Stack>

        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
          mt={{ base: 4, md: 0 }}
        >
          {(user && (
            <>
              <Menu>
                <MenuButton>
                  <Avatar src={user.imageUrl} size="md" name={user.username} />
                </MenuButton>
                <MenuList color="black">
                  <MenuItem as={RLink} to={`/users/${user.id}`}>
                    Go to Profile
                  </MenuItem>
                  <MenuItem onClick={() => mutate()}>Log out</MenuItem>
                </MenuList>
              </Menu>
            </>
          )) || (
            <Button
              _hover={{ color: 'black' }}
              size="xs"
              as={RLink}
              to="/login"
              variant="outline"
            >
              Log In
            </Button>
          )}
        </Box>
      </Flex>
    </>
  );
};
