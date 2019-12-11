import React from 'react';
import './App.css';
import Button from './components/Button';
import {Input} from './components/Input';
import ButtonClear from './components/ButtonClear';

const additionRegex = /-?\d*\.?\d+[+-]\d*\.?\d+/g;
const multiplyRegex = /-?\d*\.?\d+[*/]-?\d*\.?\d+/g;
const singleRegex = /-?\d*\.?\d+/g;

const forbiddenInputRegex = {
  'operators': /[+*/]{2,}$|^[+*/]/,
  '-': /-[-+*/]+|\+-$/,
  '.': /\d*((\.{2,}\d*)|(\.\d*)){2,}|\.[-+*/]$/
}

const operators = {
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    };
  }

  addInput = val => {
    let previousInput = this.state.input;
    if (this.ifMultipleDots(previousInput + val)) {
      return true;
    }
    this.setState({
      input: (previousInput + val)
    });
  };

  equalPressed = () => {
    let equation = this.state.input;
    let result = this.calculateResult(equation);
    this.setState({input: result.toString()});
  };

  ifMultipleDots = equation => {
    for (let key in forbiddenInputRegex) {
      if (forbiddenInputRegex[key].test(equation)) {
        return true;
      }
    }
  };

  clearInput = () => {
    this.setState({input: ''});
  };

  calculateResult = val => {
    let result = this.multiplyAndDevide(val);
    result = this.additionAndSubtraction(result);
    result = Math.round(result * 100) / 100;
    return result;
  };

  multiplyAndDevide = val => {
    let match;
    while (match = val.match(multiplyRegex)) {
      let operator = match[0].includes('*') ? '*' : '/';
      let equationNumbers = match[0].split(operator);
      let sign = (equationNumbers[0][0] === '-' && equationNumbers[1][0] === '-') ? '+' : '';
      val = val.replace(match[0], sign + (operators[operator](equationNumbers[0], equationNumbers[1])));
    }
    return val;
  };

  additionAndSubtraction = val => {
    let match;
    while (match = val.match(additionRegex)) {
      let number;
      let result = 0;
      while (number = singleRegex.exec(match[0])) {
        result += + number[0];
      }
      if (match[0][0] === '-' && result >= 0) {
        result = '+' + result;
      }
      val = val.replace(match[0], result);
    }
    return val;
  };

  render() {
    return (<div className="app">
      <div className="calculator-wraper">
        <Input input={this.state.input}></Input >
        <ButtonClear handleClick={this.clearInput}>AC</ButtonClear>

        <div className="row">
          <Button handleClick={this.addInput}>7</Button>
          <Button handleClick={this.addInput}>8</Button>
          <Button handleClick={this.addInput}>9</Button>
          <Button handleClick={this.addInput}>/</Button>
        </div>
        <div className="row">
          <Button handleClick={this.addInput}>4</Button>
          <Button handleClick={this.addInput}>5</Button>
          <Button handleClick={this.addInput}>6</Button>
          <Button handleClick={this.addInput}>*</Button>
        </div>
        <div className="row">
          <Button handleClick={this.addInput}>1</Button>
          <Button handleClick={this.addInput}>2</Button>
          <Button handleClick={this.addInput}>3</Button>
          <Button handleClick={this.addInput}>-</Button>
        </div>
        <div className="row">
          <Button handleClick={this.addInput}>0</Button>
          <Button handleClick={this.addInput}>.</Button>
          <Button handleClick={this.equalPressed}>=</Button>
          <Button handleClick={this.addInput}>+</Button>
        </div>
      </div>
    </div>);
  }
}
export default App;
