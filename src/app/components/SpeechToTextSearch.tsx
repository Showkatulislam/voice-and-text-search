"use client";

import React, { useState, useEffect, useCallback } from "react";
import Output from "./Output";
import axios from "axios";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  // Fetch search results
  const locations = ["uttara", "mirpur 10", "mirpur 2"];
  const districts = ["dhaka", "sylhet", "chattogram"];
  const name = ["organizations", "doctor"];
  const fetchSearchResults = useCallback(
    async (searchQuery = query) => {
      if (!searchQuery.trim()) return;

      try {
        const words = searchQuery
          .split(" ")
          .map((word) => word.trim().toLowerCase());
        console.log("Split words:", words);

        // Find location in the query
        const myLocation = locations.find((loc) =>
          words.some((word) => loc.toLowerCase().includes(word))
        );

        const myDistrict = districts.find((dis) =>
          words.some((word) => dis.includes(word))
        );
        const myName = name.find((dis) =>
          words.some((word) => dis.includes(word))
        );

        console.log(myLocation, myDistrict, myName);
        const response = await axios.get("/api/organization", {
          params: {
            location: myLocation,
            district: myDistrict,
            name: myName,
          },
        });
        console.log(response.data);

        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    },
    [query]
  );

  // Set up speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          fetchSearchResults(transcript);
        };

        recognition.onend = () => setIsListening(false);

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        window.recognition = recognition;
        setIsSupported(true);
      } else {
        setIsSupported(false);
      }
    }
  }, [fetchSearchResults, isSupported]);

  const startListening = () => {
    if (window.recognition) {
      setIsListening(true);
      window.recognition.start();
    }
  };

  const stopListening = () => {
    if (window.recognition) {
      setIsListening(false);
      window.recognition.stop();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Output organizations={results} />
      <div className="p-2 bg-transparent border-2 rounded-2xl mx-4">
        {!isSupported ? (
          <p>Your browser does not support Speech Recognition.</p>
        ) : (
          <div className="flex w-full items-center space-x-2">
            <button
              className={`p-2 rounded-full ${
                isListening ? "bg-orange-500" : "bg-gray-400"
              }`}
              onClick={isListening ? stopListening : startListening}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mic"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </button>
            <input
              className="w-full bg-transparent outline-none p-2 font-bold text-xl"
              type="text"
              placeholder="Type Message Here"
              value={query} // Display recognized speech in the input field
              onChange={(e) => setQuery(e.target.value)} // Allow manual text editing
            />
            <button
              onClick={() => fetchSearchResults()}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
