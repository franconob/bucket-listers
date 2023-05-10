/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Appbar, Provider as PaperProvider} from 'react-native-paper';

import {CreditCardPayment} from './src/views/CreditCardPayment/CreditCardPayment';
import {SafeAreaView, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <PaperProvider>
        <Appbar.Header mode="small" elevated>
          <Appbar.Content title="Credit card input excercise" />
        </Appbar.Header>
        <CreditCardPayment />
      </PaperProvider>
    </SafeAreaView>
  );
}

export default App;
