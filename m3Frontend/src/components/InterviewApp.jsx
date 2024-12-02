import React, { useState } from "react";
import axios from "axios";
import styles from "./InterviewApp.module.css";

function InterviewApp() {
  const [jobTitle, setJobTitle] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userResponse, setUserResponse] = useState("");

  //   form submissoion
  const handleSubmission = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/interview", {
        jobTitle,
        userResponse,
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
  return (
    <>
      <div className={styles.container}>
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
        <div className={styles.chatHistoryContainer}>
          {chatHistory.map((entry, index) => (
            <div key={index} className={styles.role}>
              <strong>{entry.role === "user" ? "You" : "AI"}</strong>
              <span>{entry.text}</span>
            </div>
          ))}
        </div>

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
      </div>
    </>
  );
}

export default InterviewApp;
