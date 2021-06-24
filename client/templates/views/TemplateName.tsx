import * as React from 'react';
import { Query } from '../../src/components/Query/Query';

type TemplateNameProps = {};

const queryFn = () => {
  return Promise.resolve('');
};
const queryKey = '';

export const TemplateName = (props: TemplateNameProps): JSX.Element => {
  return (
    <>
      <Query {...{ queryKey, queryFn }} render={() => <h1>TemplateName</h1>} />
    </>
  );
};
