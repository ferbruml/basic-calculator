import React, { useState } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Button from './src/components/Button';
import Display from './src/components/Display';

const initialState = {
  displayValue: '0',
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  current: 0, // apontador para os índices 0 ou 1 do array values
}

const App: () => Node = () => {
  const [displayValue, setDisplayValue] = useState('0')
  const [state, setState] = useState({...initialState}) // o spread operator aqui está criando um novo objeto que não tem relação com o original

  const addDigit = n => {
    
    const clearDisplay = state.displayValue === '0'
      || state.clearDisplay

    if (n === '.'
        && !clearDisplay
        && state.displayValue.includes('.')) {
      return 
    }  

    const currentValue = clearDisplay ? '' : state.displayValue
    const displayValue = currentValue + n
    setState({ displayValue, clearDisplay: false}) // aqui é false pq já foi tratado acima se for true

    if (n !== '.') {
      const newValue = parseFloat(displayValue)
      const values = [...state.values] // criamos um clone do estado atual para manter a imutabilidade
      values[state.current] = newValue
      setState({ values }) // atualizando o estado com o novo valor, garantindo a mutabilidade
    }
  }

  const clearMemory = () => {
    setState({ ...initialState })
  }
  const setOperation = operation => {
    if (state.current === 0) {
      setState({ operation, current: 1, clearDisplay: true })
    }
    else {
      const equals = operation === '='
      const values = [...state.values] // clone do array atual que temos no objeto do estado
      try {
        values[0] = eval(`${values[0]} ${state.operation} ${values[1]}`) // avalia uma expressão e retorna o resultado dela, diferente do console.log que só imprime o template string
      }
      catch(e) { // pode dar erro se a expressão a ser avaliada for, por exemplo, 23 = 2
        values[0] = state.values[0]
      }

      values[1] = 0
      setState({
        displayValue: values[0], // o resultado da operação sempre vai para o índice 0
        operation: equals ? null : operation,
        current: equals ? 0 : 1,
        //clearDisplay: !equals, // não limpa display depois do último =
        clearDisplay: true, // limpa display depois do último =
        values // setamos o estado
      })
    }
  } 
  
  return (
    <SafeAreaView style={styles.container}>
      <Display value={displayValue} />
      <View style={styles.buttons}>
        <Button label='AC' triple onClick={clearMemory} /> 
        <Button label='/' operation onClick={setOperation} /> 
        <Button label='7' onClick={addDigit} />
        <Button label='8' onClick={addDigit} />
        <Button label='9' onClick={addDigit} />
        <Button label='*' operation onClick={setOperation} />
        <Button label='4' onClick={addDigit} />
        <Button label='5' onClick={addDigit} />
        <Button label='6' onClick={addDigit} />
        <Button label='-' operation onClick={setOperation} />
        <Button label='1' onClick={addDigit} />
        <Button label='2' onClick={addDigit} />
        <Button label='3' onClick={addDigit} />
        <Button label='+' operation onClick={setOperation} />
        <Button label='0' double onClick={addDigit} />
        <Button label='.' onClick={addDigit} />
        <Button label='=' operation onClick={setOperation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

export default App;
