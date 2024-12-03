import React, { useState } from "react";
import axios from "axios";
import styles from "./InterviewApp.module.css";

function InterviewApp() {
  const [jobTitle, setJobTitle] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userResponse, setUserResponse] = useState("");
  const [resetInterview, setResetInterview] = useState(false);

  //   form submissoion
  const handleSubmission = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/interview", {
        jobTitle,
        userResponse,
        resetInterview,
      });

      //updating the chat history with user/ai responses (ui)

      setChatHistory([
        ...chatHistory,
        { role: "user", text: userResponse },
        { role: "ai", text: response.data.aiResponse },
      ]);
      setUserResponse(""); //clear
    } catch (error) {
      console.error(" ❌ error sending reponse:", error);
    }
  };

  const handleReset = () => {
    setChatHistory([]);
    setUserResponse("");
    setResetInterview(true);
  };

  const handleStartInterview = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/startInterview",
        {
          jobTitle,
        }
      );
      setChatHistory([
        {
          role: "ai",
          text: response.data.aiResponse,
        },
      ]);
      console.log("Interview started");
    } catch (error) {
      console.error("❌ Error starting interview:", error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <img
          className={styles.logo}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuUSrMhuoa9oRL7pyUTPJASr16X0Pm6Om8yQ&s"
          alt="turners logo"
        />
        <h2 className={styles.heading}>Mock Interview</h2>
        <div className={styles.jobTitleContainer}>
          <label className={styles.label}>Job Title:</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter Job Title Here"
            className={styles.inputBox}
          />
        </div>
        {/*chat history display */}
        {chatHistory.length > 0 && (
          <div className={styles.chatHistoryContainer}>
            {chatHistory.map((entry, index) => (
              <div key={index} className={styles.role}>
                <strong>{entry.role === "user" ? "You" : "AI"}</strong>
                <span>{entry.text}</span>
              </div>
            ))}
          </div>
        )}
        {/* user response input */}
        <div className={styles.userInputContainer}>
          <input
            type="text"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Type your message here"
            className={styles.inputBox}
          />
          <button onClick={handleSubmission} className={styles.submitButton}>
            Send message
          </button>
        </div>
        {/* Start Interview button */}
        <button onClick={handleStartInterview} className={styles.startButton}>
          Start Interview
        </button>
        {/* Reset button */}
        <button onClick={handleReset} className={styles.resetButton}>
          Reset Interview
        </button>
      </div>
    </>
  );
}

export default InterviewApp;
