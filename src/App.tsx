import "./App.css";
import { useEffect } from "react";
import { handleFileUpload } from "./handlers/fileUploadHandler";
import { handleSendMessage } from "./handlers/sendMessageToAi";

import process from "process";
window.process = process;

function App() {
  useEffect(() => {
    // Fetch the list of available models
    fetchAvailableModels().then((models) => {
      const modelSelect = document.getElementById("model-select");
      if (modelSelect) {
        // Clear existing options
        modelSelect.innerHTML = "";

        // Add new options
        models.forEach((model) => {
          const option = document.createElement("option");
          option.value = model.id;
          option.text = model.name;
          (modelSelect as HTMLSelectElement).add(option);
        });
      }
    });
  }, []);
  return (
    <>
      <div className="nav-header">
        <h1>🟰 Math Chat ➕</h1>
      </div>

      <div className="workarea">
        <div className="upload">
          <p></p>
          <div>
            <input
              type="file"
              name="file"
              id="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <label htmlFor="file">Upload</label>
          </div>
        </div>

        <div className="canvas">
          <img
            src="https://via.placeholder.com/300"
            alt="placeholder"
            id="uploadedImage"
          />
        </div>

        <div className="chat">
          <div id="conversation"></div>

          <div className="add-image-container">
            <input type="checkbox" name="add-image" id="add-image" />
            <label htmlFor="add-image">Add Image </label>
            <div className="model-selection">
              <label htmlFor="model-select">Select Model:</label>
              <select id="model-select" name="model-select"></select>
            </div>
          </div>

          <div className="message-box">
            <input
              type="text"
              className="input-message"
              placeholder="Type your message"
              id="input-message"
            />
            <button
              id="btn-message-send"
              type="submit"
              onClick={() => {
                const inputElement = document.getElementById(
                  "input-message"
                ) as HTMLInputElement;
                const addImageCheckbox = document.getElementById(
                  "add-image"
                ) as HTMLInputElement;
                const modelSelect = document.getElementById(
                  "model-select"
                ) as HTMLSelectElement;
                const selectedModel = modelSelect.value;
                if (inputElement) {
                  handleSendMessage(
                    inputElement.value,
                    addImageCheckbox.checked,
                    selectedModel
                  );
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Fetch the list of available models from an API or local data source
async function fetchAvailableModels() {
  // Replace this with your actual API call or data source
  const models = [
    { id: "gpt-4o-mini", name: "gpt-4o-mini" },
    { id: "claude-3-5-sonnet-20240620", name: "claude-3-5-sonnet-20240620" },
  ];
  return models;
}

export default App;
