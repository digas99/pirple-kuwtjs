import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
      input: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      inputVal: e.target.value,
      input: e.target
    });
  }

  handleClick() {
    if (this.state.inputVal.length === 0) {
      return;
    }

    // send upwards the value of the input, through a callback
    this.props.getVal(this.state.inputVal);

    let input = this.state.input;
    input.value = '';

    this.setState({
      inputVal: '',
      input: ''
    });
  }

  render() {
    return (
      <div>
        <h3>Entry: </h3>
        <div className="inputs-wrapper">
          <input 
            placeholder="add to list"
            onChange={this.handleChange}
          ></input>
          <button 
            id="add"
            onClick={this.handleClick.bind(this)}
          >+</button>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVals: []
    }
  }

  updateVals = value => this.setState(state => ({inputVals: state.inputVals.concat(value)}));

  render() {
    return (
      <div className="todolist-container">
        <h1>TODO list</h1>
        <div className="middle">
          <div>
            <Input
              getVal={this.updateVals}
              app={this}
            />
          </div>
          <div className="content">
            <h3 id="list">List({this.state.inputVals.length}):</h3>
            <List items={this.state.inputVals} />
          </div>
        </div>
      </div>
    );
  }
}

class List extends React.Component {
  render() {
    if(this.props.items.length === 0) {
      return (
          <p id="empty-list">The list is empty!</p>
      );
    }
    else {
      return (
        <ul>
          {this.props.items.map(item => (
            <li key={"item"+this.props.items.length} className="item">{item}</li>
          ))}
        </ul>
      );
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);