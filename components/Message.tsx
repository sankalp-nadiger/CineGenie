import React, { useState } from "react";
import styled from "styled-components";

interface InputProps {
  sendMessage: (messageText: string) => void;
}

const Input: React.FC<InputProps> = ({ sendMessage }) => {
  const [messageText, setMessageText] = useState("");

  const handleSend = () => {
    if (messageText.trim()) {
      sendMessage(messageText); // Send the message
      setMessageText(""); // Clear input
    }
  };

  return (
    <StyledWrapper>
      <div className="messageBox">
        {/* File Upload Button */}
        <div className="fileUploadWrapper">
          <label htmlFor="file">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
              <circle strokeWidth={20} stroke="#6c6c6c" fill="none" r="158.5" cy="168.5" cx="168.5" />
              <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M167.759 79V259" />
              <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M79 167.138H259" />
            </svg>
            <span className="tooltip">Add an image</span>
          </label>
          <input type="file" id="file" name="file" />
        </div>

        {/* Message Input */}
        <input
          required
          placeholder="Message..."
          type="text"
          id="messageInput"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()} // Send on Enter key
        />

        {/* Send Button */}
        <button id="sendButton" onClick={handleSend} aria-label="Send Message">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
            <path fill="none" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="33.67" stroke="#6c6c6c" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
          </svg>
        </button>
      </div>
    </StyledWrapper>
  );
};

// Styled Components
const StyledWrapper = styled.div`
  .messageBox {
    width: 800px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(51, 50, 50);
    padding: 0 15px;
    border-radius: 10px;
    border: 1px solid rgb(63, 63, 63);
  }

  .messageBox:focus-within {
    border: 1px solid rgb(110, 110, 110);
  }

  .fileUploadWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #file {
    display: none;
  }

  .fileUploadWrapper label {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .fileUploadWrapper label svg {
    height: 18px;
    transition: all 0.3s;
  }

  .fileUploadWrapper label:hover svg path {
    stroke: #fff;
  }

  .fileUploadWrapper label:hover svg circle {
    stroke: #fff;
    fill: #3c3c3c;
  }

  .fileUploadWrapper label:hover .tooltip {
    display: block;
    opacity: 1;
  }

  .tooltip {
    position: absolute;
    top: -40px;
    display: none;
    opacity: 0;
    color: white;
    font-size: 10px;
    white-space: nowrap;
    background-color: #000;
    padding: 6px 10px;
    border: 1px solid #3c3c3c;
    border-radius: 5px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.6);
    transition: all 0.3s;
  }

  #messageInput {
    flex-grow: 1;
    margin-left: 10px;
    background-color: transparent;
    outline: none;
    border: none;
    color: white;
    height: 100%;
  }

  #messageInput:focus ~ #sendButton svg path,
  #messageInput:valid ~ #sendButton svg path {
    fill: #3c3c3c;
    stroke: white;
  }

  #sendButton {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  #sendButton svg {
    height: 18px;
    transition: all 0.3s;
  }

  #sendButton:hover svg path {
    fill: #3c3c3c;
    stroke: white;
  }
`;

export default Input;
