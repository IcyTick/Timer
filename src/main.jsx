import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import './App.css';

const Timer = () => {
  const [miliSec, setMiliSec] = useState(0);
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [resetNeed, setResetNeed] = useState(false);

  useEffect(() => {
    let intervalId;
    if (startTimer) {
      intervalId = setInterval(() => {
        if (miliSec < 99) {
          setMiliSec(miliSec => miliSec + 1);
        } else if (sec < 59) {
          setMiliSec(0);
          setSec(sec => sec + 1);
        } else {
          setSec(0);
          setMin(min => min + 1);
        }
      }, 8.9999999999999999);
      setResetNeed(true);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [startTimer, miliSec, sec, min]);

  const handleReset = () => {
    setResetNeed(false);
    setStartTimer(false);
    setSec(0);
    setMin(0);
    setMiliSec(0);
  };

  return (
    <div className="whole">
      <div className="timer">
        <h1>
          {min < 10 ? "0" + min : min}:
          {sec < 10 ? "0" + sec : sec}.
          {miliSec < 10 ? "0" + miliSec : miliSec}
        </h1>
      </div>
      <div className="button">
        {!resetNeed && (
          <button id="start" onClick={() => setStartTimer(true)}>
          </button>
        )}
        {resetNeed && !startTimer && (
          <button id="reset" onClick={handleReset}>
          </button>
        )}
        {resetNeed && !startTimer && (
          <button id="resume" onClick={() => setStartTimer(true)}>
          </button>
        )}
        {startTimer && (
          <button id="pause" onClick={() => setStartTimer(false)}>
          </button>
        )}
      </div>
    </div>
  );
}

export default Timer;
ReactDOM.render(<Timer />, document.getElementById('root'));
