import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import './App.css';
import './assets/css/fonts.css';
import start from './assets/start.png';
import pause from './assets/pause.png';
import addStop from './assets/addStop.png';
import remStop from './assets/remStop.png';
import reset from './assets/reset.png';
import alarm from './assets/alarm.png';

const Timer = () => {
  const [time, setTime] = useState({ min: 0, sec: 0, miliSec: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [usePersianNumbers, setUsePersianNumbers] = useState(false);
  const [stops, setStops] = useState([]);
  const [showStops, setShowStops] = useState(false);

  // Convert numbers to Persian/Arabic format
  const toPersianNumber = (num) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  };

  // Format time with optional Persian numbers
  const formatTime = (value) => {
    const formattedValue = value < 10 ? `0${value}` : value;
    return usePersianNumbers ? toPersianNumber(formattedValue) : formattedValue;
  };

  // Add a time stop to the log
  const addTimeStop = () => {
    setStops(prev => [...prev, { ...time, id: Date.now() }]);
  };

  // Remove a time stop from the log
  const removeTimeStop = (id) => {
    setStops(prev => prev.filter(stop => stop.id !== id));
  };

  // Clear all time stops
  const clearAllStops = () => {
    setStops([]);
  };

  // Reset the timer
  const handleReset = () => {
    setIsRunning(false);
    setTime({ min: 0, sec: 0, miliSec: 0 });
  };

  // Toggle number format between English and Persian
  const toggleNumberFormat = () => {
    setUsePersianNumbers(!usePersianNumbers);
  };

  // Timer effect
  useEffect(() => {
    let intervalId;
    
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prev => {
          let { min, sec, miliSec } = prev;
          
          if (miliSec < 99) {
            miliSec += 1;
          } else if (sec < 59) {
            miliSec = 0;
            sec += 1;
          } else {
            miliSec = 0;
            sec = 0;
            min += 1;
          }
          
          return { min, sec, miliSec };
        });
      }, 10);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  return (
    <div className={`whole persian-support`}>
      <div className="timer">
        <h1 className="timer-font">
          {formatTime(time.min)}:
          {formatTime(time.sec)}.
          {formatTime(time.miliSec)}
        </h1>
      </div>

      <div className="button-group">
        {!isRunning && time.min === 0 && time.sec === 0 && time.miliSec === 0 ? (
          <button className="control-btn" onClick={() => setIsRunning(true)}>
            <img src={start} alt="Start" />
          </button>
        ) : !isRunning ? (
          <>
            <button className="control-btn" onClick={() => setIsRunning(true)}>
              <img src={start} alt="Resume" />
            </button>
            <button className="control-btn" onClick={handleReset}>
              <img src={reset} alt="Reset" />
            </button>
          </>
        ) : (
          <>
            <button className="control-btn" onClick={() => setIsRunning(false)}>
              <img src={pause} alt="Pause" />
            </button>
            <button className="control-btn" onClick={addTimeStop}>
              <img src={addStop} alt="Add Stop" />
            </button>
          </>
        )}

        <button 
          className="control-btn number-toggle"
          onClick={toggleNumberFormat}
        >
          {usePersianNumbers ? 'EN' : 'فا'}
        </button>

        {stops.length > 0 && (
          <button 
            className="control-btn" 
            onClick={() => setShowStops(!showStops)}
          >
            <img src={alarm} alt="Toggle Stops" />
          </button>
        )}
      </div>

      {showStops && stops.length > 0 && (
        <>
          <button className="clear-stops-btn" onClick={clearAllStops}>
            {usePersianNumbers ? 'پاک کردن همه' : 'Clear All'}
          </button>
          <div className={`stops-log ${usePersianNumbers ? 'rtl' : ''}`}>
            <h3>{usePersianNumbers ? 'زمان‌های ثبت شده' : 'Recorded Times'}</h3>
            <ul>
              {stops.map((stop, index) => (
                <li key={stop.id}>
                  <span>
                    {(usePersianNumbers ? toPersianNumber(index + 1) : index + 1)}. {formatTime(stop.min)}:
                    {formatTime(stop.sec)}.
                    {formatTime(stop.miliSec)}
                  </span>
                  <button 
                    className="remove-stop-btn" 
                    onClick={() => removeTimeStop(stop.id)}
                  >
                    <img src={remStop} alt="Remove" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Timer;
ReactDOM.render(<Timer />, document.getElementById('root'));