import * as React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
} from '@chakra-ui/react';

type DeletionVerificationProps = {
  alertProps?: Omit<AlertDialogProps, 'isOpen' | 'onClose' | 'children' | 'leastDestructiveRef'>;
  bodyText: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: ()=> void;
  title: string;
};

export const DeletionVerification = ({
  isOpen,
  onClose,
  alertProps,
  title,
  bodyText,
  onDelete,
}: DeletionVerificationProps): JSX.Element => {
  const cancelRef = React.useRef(null);
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        {...alertProps}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{bodyText}</AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme='blue' ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={onDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
