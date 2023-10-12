'use client';
/* eslint-disable padded-blocks */
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("main gate to hostel circle");
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const initialTime = `${hours}:${minutes}:${seconds}`;
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [nextResults, setNextResults] = useState<string[]>([]);

  useEffect(() => {
    // Fetch data from the JSON file
    fetch('/bus_schedule.json')
      .then((response) => response.json())
      .then((jsonData) => {
        const selectedData = jsonData[selectedOption];
        setData(selectedData);
        updateNextResults(selectedData);
      })
      .catch((error) => {
        console.error(error);
      });

    // Initial call to update time
    updateTime();

    // Set up an interval to update time every second (1000 milliseconds)
    const intervalId = setInterval(updateTime, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [selectedOption]);

  // Function to update the next 10 results
  const updateNextResults = (selectedData : string[]) => {
    const currentIndex = selectedData.findIndex((time) => time >= currentTime);
    if (currentIndex === -1) {
      setNextResults([]);
    } else {
      const nextResultsSlice = selectedData.slice(currentIndex, currentIndex + 10);
      setNextResults(nextResultsSlice);
    }
  };

  const updateTime = () => {
    // Get the current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}:${seconds}`);
    // updateNextResults(data);
  };

  const handleOptionChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedOption(e.target.value);
    // Update next results when the selected option changes
    updateNextResults(data);
  };

  const displayAllTimings = () => {
    return (
      <div className="ml-5 mt-4 mr-5 max-h-64 overflow-y-scroll">
        <style>
          {`
            /* Style the scrollbar for Webkit (Chrome, Safari) */
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #f1f1f1;
            }
            ::-webkit-scrollbar-thumb {
              background: #888;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}
        </style>
        <ul>
          {data.map((time, index) => (
            <li key={index}>{time}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 ml-5">Bus Schedule</h1>
      <div className="mb-4 ml-5">
        <label htmlFor="busOptions" className="mr-5">
          Select an option:
        </label>
        <select
          id="busOptions"
          value={selectedOption}
          onChange={handleOptionChange}
          className="bg-blue-100 text-blue-800 border-blue-500 rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
        >
           <option value="main gate to hostel circle">Main Gate to Hostel Circle</option>
          <option value="hostel circle to main gate">Hostel Circle to Main Gate</option>
          {/* <option value="hostel circle to new hostels">Hostel Circle to New Hostels</option>
          <option value="new hostels to hostel circle">New Hostels to Hostel Circle</option>
          <option value="hospital to trp">Hospital to TRP</option> */}
        </select>
      </div>
      <h2 className="text-xl font-semibold mb-2 ml-5">Selected Path: {selectedOption}</h2>
      <p className="ml-5">Current Time: {currentTime}</p>
      <h2 className="text-xl font-semibold mb-2 ml-5">Timings of next 10 Buses:</h2>
      <ul className="ml-5">
        {nextResults.map((time, index) => (
          <li key={index}>{time}</li>
        ))}
      </ul>
      <div className="ml-5 mt-4 max-h-64">
        <h2 className="text-xl font-semibold mb-2">All Timings for {selectedOption}:</h2>
      </div>
      {displayAllTimings()}
    </div>
  );
};

export default Page;
