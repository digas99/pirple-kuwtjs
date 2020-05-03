import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Queue from './queue';
import stickman from './images/stickman.png'

const Wrapper = ({children}) => children;

const randomFloor = () => Math.floor(Math.random() * (10 - (-1)) + (-1));
const randomPeople = (max) => Math.floor(Math.random() * (max - 1) + 1); 

class Elevator extends React.Component {
  // change look of elevator when cliked and marks as selected
  activateElevator(e) {
    const elevator = e.target;
    elevator.style.backgroundColor = "#c33c3c";
    setTimeout(() => {
      elevator.style.backgroundColor = "gray";
      elevator.classList.add("elevator-active");
    }, 400);
    this.props.select(this.props.id);
  }

  render() {
    return (
      <div className="elevator-wrapper">
        <div onClick={(e) => this.activateElevator(e)} className="elevator center-block">{this.props.name}</div>
      </div>
    );
  }
}

class Structure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elevators_info: [
        {
          floor: 0,
          height: 503,
          queue: new Queue(),
        },
        {
          floor: 0,
          height: 503,
          queue: new Queue()
        }
      ],
      people: [],
      first_move: true,
      leaving_elevator: [0, 0]
    };
  }

  // runs function play, depending on which elevator was clicked
  getElevator = id => {
    this.play(id);
  }

  // changes value of height which will be the value of the css property 'top' in the elevator div 
  moveElevator(elevator, floor) {
    if (floor != null) {
      let diff = floor - this.state.elevators_info[elevator].floor;
      let tmp = this.state.elevators_info.slice();
      tmp[elevator].floor = floor;
      tmp[elevator].height = this.state.elevators_info[elevator].height - diff*48;
      this.setState({
        elevators_info: tmp
      });
    }
  }

  // changes elevator 'move speed' according to which floor it needs to go
  // also returns the time it takes
  changeElevatorTransition(elevator, floor) {
    // change elevator transition time depending on the targeted floor
    const elevators_elems = document.getElementsByClassName("elevator-container");
    const diff = Math.abs(floor-this.state.elevators_info[elevator].floor);
    elevators_elems[elevator].style.transition = diff+"s";
    return diff;
  }

  // creates a set number of people randomly
  // this means that their starting point and target are random
  createPeople(nmr) {
    let tmp = [];
    for (let i = 0; i < nmr; i++) {
      let start = randomFloor();
      let end = randomFloor();
      while (start === end) {
        end = randomFloor();
      }
      tmp.push({start_floor: start, end_floor: end, in_elevator: false, completed: false});
    }
    return tmp;
  }

  // checks for a floor in a given array of floors that is closest to the current
  closesteFloor(current, floors) {
    let min = Math.abs(floors[0]-current);
    let closest_floor = floors[0];
    for (let i = 1; i < floors.length; i++) {
      let diff = Math.abs(floors[i]-current);
      if (diff < min) {
        min = diff;
        closest_floor = floors[i];
      }
    }
    return closest_floor;
  }

  // returns an array with the number of people in each floor
  getPeopleInFloors(people) {
    let peopleInFloors = Array(13).fill(0);
    let peopleOutsideElevator = people.filter(person => !person.in_elevator);
    for (let i = 0; i <= 11; i++) {
      for (const person of peopleOutsideElevator) {
        if (person.start_floor === i-1) {
          peopleInFloors[i]++;
        }
      }
    }
    return peopleInFloors;
  }

  // triggeres the move depending on certain conditions
  play(elev) {
    let elevator_info = this.state.elevators_info[elev];
    let tmp_people = [];

    // if the elevator was just clicked, then get a new array of people
    if (this.state.first_move) {
      let number = this.props.nmrPeople === 1 ? "person wants" : "people want";
      this.props.consoleHeader(`${this.props.nmrPeople} ${number} to ride the elevator!`);
      tmp_people = this.createPeople(this.props.nmrPeople);
    }
    // if not the elevators first trip, then load the already existing array of people
    else
      tmp_people = this.state.people;

    let all_completed = true;
    let not_completed_people = tmp_people.filter(person => !person.completed);
    let people_leaving = 0;
    let people_entering = 0;

    // iterate over the people that haven't completed their 'journey'
    for (const person of not_completed_people) {
      // start all over again
      if (all_completed) {
        all_completed = false;
      }
      // if person is supposed to enter in this floor
      if (person.start_floor === elevator_info.floor) {
        people_entering++;
        person.in_elevator = true;
      }
      // if person is in the elevator and is supposed to leave in this floor
      else if (person.in_elevator && person.end_floor === elevator_info.floor) {
        people_leaving++;
        person.completed = true;
      }
    }

    let allElevatorsPeopleLeaving = this.state.leaving_elevator.slice();
    allElevatorsPeopleLeaving[elev] = people_leaving;

    // checks for all gatherings of people in each floor, and if they are in
    // the same floor as the elevator, then create their motion towards the elevator
    for (const floor of document.getElementById("building").children) {
      if (parseInt(floor.innerText) === elevator_info.floor) {
        if (floor.children[0].children[0].children[0])
          floor.children[0].children[0].children[0].children[0].classList.add("person-go-right");
      }
    }

    // updates the number of people in each floor with the new array of people
    const delay = this.state.first_move ? 0 : 400;
    setTimeout(() => {
      this.props.peopleInFloors(this.getPeopleInFloors(tmp_people));
    }, delay);

    if (!all_completed) {
      // gets the floors that need to be visited by the elevator to both drop
      // and pick up people
      let floors_called = [], floors_target = [], floors = [];
      for (const person of tmp_people) {
        if (!person.completed) {
          if (person.in_elevator) {
            floors_target.push(person.end_floor);
          }
          else {
            floors_called.push(person.start_floor);
          }
        }
      }

      // creates a set with both arrays of floors that need to be visited by
      // the elevator to both drop and pick up people
      floors = [...new Set(floors_target.concat(floors_called))];

      let this_elevator_span = document.getElementsByClassName("elevator-container")[elev].querySelector("span");
      if (floors.length > 0) {
        let closest_needed_floor = this.closesteFloor(elevator_info.floor, floors);

        let name = elev === 0 ? "A" : "B";
        this.props.consoleLog(`Elevator ${name}: Entered: ${people_entering} | Left: ${allElevatorsPeopleLeaving[elev]} | Next Floor: ${closest_needed_floor}`);

        if (this.state.first_move) {
          this.setState({
            people: tmp_people,
            first_move: false,
            leaving_elevator: allElevatorsPeopleLeaving
          });
        }
        else {
          this.setState({
            people: tmp_people,
            leaving_elevator: allElevatorsPeopleLeaving
          });
        }

        this_elevator_span = document.getElementsByClassName("elevator-container")[elev].querySelector("span");
        if (this.state.first_move && this_elevator_span)
          this_elevator_span.classList.remove("hidden");
        
        if (this_elevator_span) {
          setTimeout(() => {
            this_elevator_span.classList.add("fade");
          }, 800);
        }

        const time = this.changeElevatorTransition(elev, closest_needed_floor)*1000;

        setTimeout(() => {
          this.moveElevator(elev, closest_needed_floor);
        }, 500);

        // after waiting a certain time for the elevator to reach the floor
        // call the function play again to start the process all over again
        setTimeout(() => {
          this.play(elev);

          if (this_elevator_span && this_elevator_span.classList.contains("fade"))
            this_elevator_span.classList.remove("fade");
        }, time);
      }
      // IDLE
      else {
        let name = elev === 0 ? "A" : "B";
        this.props.consoleLog(`Elevator ${name}: Entered: ${people_entering} | Left: ${allElevatorsPeopleLeaving[elev]} | Next Floor: Idle`);

        const msg = this.props.nmrPeople === 1 ? "The 1 person was taken to his floor with success!" : `All ${this.props.nmrPeople} people were taken to their floor with success!`; 
        this.props.consoleLog(msg);

        setTimeout(() => {
          if (this_elevator_span)
            this_elevator_span.classList.add("fade");
          document.getElementsByClassName("elevator")[elev].classList.remove("elevator-active");
        }, 500);

        this.setState({
          first_move: true
        });
      }
    }
  }

  // creates the indicator of the number of people who left in that floor
  setSpan(leaving) {
    if (leaving !== 0) {
      return (<span className="left-elevator-number">{`-${leaving}`}</span>);
    }
  }

  render() {
    // creates all 11 floors
    let floorElems = this.props.setFloors(this.props.floors);

    return(
      <div className="center-block" id="structure">
        <ul id="building">
          {floorElems.map(floor => (floor))}
        </ul>
        <div style={{marginRight: '85px', top: this.state.elevators_info[0].height}} className="elevator-container">
          {this.setSpan(this.state.leaving_elevator[0])}
          <Elevator
            select={this.getElevator}
            id={0}
            name={"A"}
          />
        </div>
        <div style={{top: this.state.elevators_info[1].height}} className="elevator-container">
          {this.setSpan(this.state.leaving_elevator[1])}
          <Elevator
            select={this.getElevator}
            id={1}
            name={"B"}
          />
        </div>
      </div>
    );
  }
}

class Console extends React.Component {
  render() {
    let i = 0;
    return (
      <div id="console-container">
        <div id="console-wrapper">
          <div id="logs-wrapper">
            <p className="console-header" key="header">{this.props.header_text}</p>
            {this.props.log_text.map(msg => (
              <p key={"log"+(i++)}>{msg}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

class Building extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      log: [],
      header: null,
      people_in_floors: [],
      nmr_people: 0
    };
    this.consoleLog= this.consoleLog.bind(this);
    this.consoleHeader = this.consoleHeader.bind(this);
    this.setPeopleInFloors = this.setPeopleInFloors.bind(this);
    this.setFloors = this.setFloors.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  setFloors(nmr) {
    // function responsable to add the stickmen
    const addPeople = (floor, nmrPeople) => {
      let people = [];
      for (let i = 0; i < nmrPeople; i++) {
        people.push(<li key={`fl${floor}prsn${i}`}><img className="person" src={stickman} alt="person"></img></li>);
      }

      return (
        <div >
          <ul className="people-wrapper">
              {people.map(person => person)}
          </ul>
        </div>
      );
    }
    
    // usage of array with the number of people in each floor to create the stickmen
    let tmp = [];
    for(let i = nmr-1; i >= 0; i--) {
      tmp.push(
        <li key={"floor"+(i-1)}>
          {i-1}
          {addPeople(i-1, this.state.people_in_floors[i])}
        </li>
      );
    }
    return tmp;
  }

  setPeopleInFloors(arr) {
    this.setState({
      people_in_floors: arr
    });
  }

  consoleLog(msg) {
    const tmp = this.state.log.slice();
    tmp.push(msg);
    this.setState({
      log: tmp
    });
  }

  consoleHeader(msg) {
    let tmp = this.state.header;
    tmp = msg;
    this.setState({
      header: tmp,
    });
  }

  handleChange(e) {
    this.setState({
      nmr_people: e.target.value
    });
  }

  render() {
    const nmr = this.state.nmr_people > 0 ? this.state.nmr_people : randomPeople(100); 
    return(
      <Wrapper>
        <div>
          <h1 id="title">Building</h1>
        </div>
        <div id="settings-wrapper">
          <ul>
            <li>
              <label>Nmr of People: </label>
              <input
                placeholder="random"
                onChange={this.handleChange}
                id="nmr-people-input"
              ></input>
            </li> 
          </ul>
        </div>
        <Structure
          floors={12}
          consoleLog={this.consoleLog}
          consoleHeader={this.consoleHeader}
          setFloors={this.setFloors}
          nmrPeople={nmr}
          peopleInFloors={this.setPeopleInFloors}
        />
        <Console 
          log_text={this.state.log}
          header_text={this.state.header}
        />
      </Wrapper>
    );
  }
}

ReactDOM.render(
  <Building />,
  document.getElementById('root')
);