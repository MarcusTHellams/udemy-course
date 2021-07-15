import { Table, TableProps } from '@chakra-ui/react';
import { TableProps as ReactTableProps } from 'react-table';
import * as React from 'react';

type ResponsiveTableProps = {
  reactTableProps?: ReactTableProps;
  tableProps?: TableProps;
};

export const ResponsiveTable = ({
  children,
  tableProps,
  reactTableProps,
}: React.PropsWithChildren<ResponsiveTableProps>): JSX.Element => {
  return (
    <>
      <Table
        sx={{
          'thead tr': {
            position: ['absolute', null, 'inherit'],
            left: '-9999px',
            top: '-9999px',
          },
          tr: {
            border: ['1px solid black', null, 'inherit'],
            px: [4, null, 'inherit'],
          },
          td: {
            display: ['block', null, 'table-cell'],
            position: ['relative', null, 'inherit'],
            paddingLeft: ['50%', null, 'inherit'],
            '&:before': {
              top: '5',
              left: '0.375rem',
              position: 'absolute',
              content: 'attr(data-th)":"',
              fontWeight: 'bold',
              w: '45%',
              whiteSpace: 'nowrap',
              display: [null, null, 'none'],
            },
          },
        }}
        {...tableProps}
        {...reactTableProps}
      >
        {children}
      </Table>
    </>
  );
};
