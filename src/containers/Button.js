import React from 'react';
import {Button as ButtonRN} from 'src/components';

const Button = ({...rest}) => {
  return <ButtonRN {...rest} />;
};

export default Button;
