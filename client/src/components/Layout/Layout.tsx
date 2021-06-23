import * as React from 'react';
import { Container } from '@chakra-ui/react';

type LayoutProps = {
  [key: string]: any;
};

export const Layout = ({ children, ...rest }: LayoutProps): JSX.Element => {
  return (
    <>
      <Container maxW="95vw" mt={4} {...rest}>{children}</Container>
    </>
  );
};
