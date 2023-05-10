import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {Button} from 'react-native-paper';
import {CardData} from '../../validation/creditCard';
import {Input} from '../../components/Input';

import styles from './styles';
import {useValidator} from '../../validation/useValidator';

const CreditCardPayment = () => {
  const [form, setForm] = useState<CardData>({
    cardNumber: '',
    cvv: '',
    expDate: '',
    firstName: '',
    lastName: '',
  });
  const {validate, isValid, errors} = useValidator();

  const handleInputChange = (field: string, value: string) =>
    setForm({...form, [field]: value});

  const handleSubmit = () => {
    validate(form);

    if (isValid()) {
      Alert.alert('Payment Successful');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.singleRow}>
        <Input
          mode="outlined"
          label="Card number"
          fieldError={errors?.cardNumber}
          onChangeText={value => handleInputChange('cardNumber', value)}
        />
      </View>

      <View style={[styles.singleRow, styles.twoColumns]}>
        <Input
          mode="outlined"
          label="MM/YY"
          placeholder="MM/YY"
          onChangeText={value => handleInputChange('expDate', value)}
          fieldError={errors?.expDate}
        />
        <Input
          mode="outlined"
          label="CVV"
          onChangeText={value => handleInputChange('cvv', value)}
          fieldError={errors?.cvv}
        />
      </View>
      <View style={styles.doubleRow}>
        <Input
          mode="outlined"
          label="First name"
          onChangeText={value => handleInputChange('firstName', value)}
          fieldError={errors?.firstName}
        />
        <Input
          mode="outlined"
          label="Last name"
          onChangeText={value => handleInputChange('lastName', value)}
          fieldError={errors?.lastName}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSubmit}>
          SUBMIT PAYMENT
        </Button>
      </View>
    </View>
  );
};

export {CreditCardPayment};
