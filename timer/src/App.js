import React from 'react';
import logo from './logo.svg';
const DEFAULT_WORK_MINS = 25;
const DEFAULT_BREAK_MINS = 5;

const minToSec = mins => mins * 60;


function SetTimer(props) {
  console.log("in set Timer");
  let timer;
  let ms, timeToReach;

  ms = props.time * 1000;
  timeToReach = Date.now() + ms;
  timer = <Timer timeToReach={timeToReach} onEnd={props.onEnd} />;

  return <div>{timer}</div>;
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    console.log("in timer constructor");
    this.state = {
      timeRemaining: 0,
      min: 0,
      sec: 0,
      activeTimer: "work"
    };
  }

  startTimer = props => {
    console.log("in startTimer");
    let timeRemaining, min, sec, msec;
    timeRemaining = this.props.timeToReach - Date.now();
    console.log(timeRemaining);
    this.setState({
      timeRemaining: timeRemaining
    });
    min = Math.floor(timeRemaining / 60000);
    msec = timeRemaining % 60000;
    sec = Math.floor(msec / 1000);

    if (timeRemaining >= 0) {
      this.setState({
        timeRemaining: timeRemaining,
        min: min,
        sec: sec
      });
    } else {
      console.log("timer end");
      this.handleEnd();
    }
  };

  componentDidMount() {
    console.log("in component mount");
    this.interval = setInterval(this.startTimer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleEnd = () => {
    console.log("in handle end");

    this.props.onEnd();
  };

  render() {
    console.log("in render of timer");
    return (
      <div>
        <h1>
          {this.state.min} : {this.state.sec}
        </h1>
      </div>
    );
  }
}

class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mins: 0,
      secs: 0
    };
  }

  handleMinChange = e => {
    let mins = e.target.value;
    this.setState({
      mins: mins
    });
    let x = Number(mins) * 60;
    let y = this.state.secs;
    this.props.afterChange(Number(x) + Number(y));
  };

  handleSecChange = e => {
    let secs = e.target.value;
    this.setState({
      secs: secs
    });
    let x = Number(secs);
    let y = this.state.mins * 60;
    this.props.afterChange(Number(x) + Number(y));
  };

  render() {
    return (
      <div>
        <p>enter {this.props.title} time:</p>
        <input
          type="number"
          min="0"
          max="60"
          placeholder="mins"
          onChange={this.handleMinChange}
        />

        <input
          type="number"
          min="0"
          max="60"
          placeholder="secs"
          onChange={this.handleSecChange}
        />
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    workTime: minToSec(DEFAULT_WORK_MINS),
    breakTime: minToSec(DEFAULT_BREAK_MINS),
    timeRemaining: minToSec(DEFAULT_WORK_MINS) * 1000,
    isStudyTime: false
  };

  handleTimerEnd = () => {
    console.log("in handleTimerEnd");
    this.setState(prevState => ({
      isStudyTime: !prevState.isStudyTime
    }));
  };

  upDateTime = target => sec => {
    console.log("i am in updatetime");
    console.log(sec);

    console.log(target);
    this.setState({
      [`${target}Time`]: sec,
      timeRemaining: sec * 1000
    });
  };

  render() {
    console.log(this.state.isStudyTime);
    const setTimer = this.state.isStudyTime ? (
      <SetTimer time={this.state.workTime} onEnd={this.handleTimerEnd} />
    ) : (
      <SetTimer time={this.state.breakTime} onEnd={this.handleTimerEnd} />
    );

    const text = this.state.isStudyTime ? "workTime: " : "breakTime: ";
    return (
      <div className="App">
        <InputText title="WORK" afterChange={this.upDateTime("work")} />
        <InputText title="BREAK" afterChange={this.upDateTime("break")} />
        <div>
          {text}
          {setTimer}
        </div>
      </div>
    );
  }
}




export default App;
