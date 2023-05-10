import React from 'react';
import {TextInput, HelperText} from 'react-native-paper';
import {Props as TextInputProps} from 'react-native-paper/src/components/TextInput/TextInput';
import {View} from 'react-native';

import styles from './styles';

interface Props extends TextInputProps {
  fieldError: string | undefined;
}

const Input = ({fieldError, ...textInputProps}: Props) => {
  return (
    <View style={styles.container}>
      <TextInput {...textInputProps} error={!!fieldError} />
      <HelperText type="error" visible={!!fieldError}>
        {fieldError}
      </HelperText>
    </View>
  );
};

export {Input};
