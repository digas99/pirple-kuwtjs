import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Screen extends React.Component {
  render() {
    if (this.props.res === '') {
      return (
        <p>
          {this.props.op1}
          <span className="space"></span>
          {this.props.operand}
          <span className="space"></span>
          {this.props.op2}
          
        </p>
      );
    }
    else {
      return (
        <p>
          {this.props.res}
        </p>
      );
    }
  }
}

class Operators extends React.Component {
  render() {
    return (
      <div>
        {this.props.renderButton('+')}
        {this.props.renderButton('-')}
        {this.props.renderButton('x')}
        {this.props.renderButton('/')}
      </div>
    );
  }
}

class Numbers extends React.Component {
  render() {
    return (
      <div>
        <div className="nums-row">
          {this.props.renderButton(1)}
          {this.props.renderButton(2)}
          {this.props.renderButton(3)}
        </div>
        <div className="nums-row">
          {this.props.renderButton(4)}
          {this.props.renderButton(5)}
          {this.props.renderButton(6)}
        </div>
        <div className="nums-row">
          {this.props.renderButton(7)}
          {this.props.renderButton(8)}
          {this.props.renderButton(9)}
        </div>
        <div className="nums-row">
          {this.props.renderButton('C')}
          {this.props.renderButton(0)}
          {this.props.renderButton('=')}
        </div>
      </div>
    );
  }
}

function CalculatorButton(props) {
  return (
    <button onClick={props.onClick} >
      {props.val}
    </button>
  );
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      op1: '',
      operand: '',
      op2: '',
      res: ''
    };
    this.renderButton = this.renderButton.bind(this);
  }

  handleClick (val) {
    if (this.state.res !== '') {
      this.setState({
        op1: '',
        operand: '',
        op2: '',
        res: ''
      });
    }

    if (val === 'C') {
      this.setState({
        op1: '',
        operand: '',
        op2: '',
        res: ''
      });
      return;
    }

    // if val is a number
    if (!isNaN(val)) {
      // if there is not an operand yet
      if (this.state.operand === '') {
        this.setState({
          op1: this.state.op1+val,
          operand: '',
          op2: '',
          res: ''
        });
      }
      else {
        this.setState({
          op1: this.state.op1,
          operand: this.state.operand,
          op2: this.state.op2+val,
          res: ''
        });
      }
    }
    else {
      if (this.state.operand === '' && this.state.op1 !== '') {
        this.setState({
          op1: this.state.op1,
          operand: val,
          op2: '',
          res: ''
        });
      }
      else if(this.state.op1 !== '' && this.state.op2 !== '' && this.state.operand !== '') {
        if (val === '=') {
          let result = '';
          let op1 = parseInt(this.state.op1);
          let op2 = parseInt(this.state.op2);
          switch(this.state.operand) {
            case '+':
              result = op1+op2;
              break;
            case '-':
              result = op1-op2;
              break;
            case 'x':
              result = op1*op2;
              break;
            case '/':
              result = op1/op2;
              break;
            default:
              result = 'ERROR';
              break;
          }

          this.setState({
            op1: '',
            operand: '',
            op2: '',
            res: result
          });
        }
        else {
          return;
        }
      }
    }
  }

  renderButton(val) {
    return (
      <CalculatorButton 
        onClick= {() => this.handleClick(val)}
        val={val}
      />
    );
  }

  render() {
    return (
      <div>
        <h1 id="title">Calculator</h1>
        <div className="calculator-container">
          <div className="calculator">
            <div className="screen">
              <Screen
                op1={this.state.op1}
                op2={this.state.op2}
                operand={this.state.operand}
                res={this.state.res}
              /> 
            </div>
            <div className="buttons">
              <div className="numbers">
                <Numbers renderButton={this.renderButton} />
              </div>
              <div className="operators">
                <Operators renderButton={this.renderButton} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);