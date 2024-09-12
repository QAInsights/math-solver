import "./App.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Button, Form } from 'react-bootstrap';
import { handleFileUpload } from "./handlers/fileUploadHandler";
import { handleSendMessage } from "./handlers/sendMessageToAi";
import Login from "./Login";
import Logout from "./Logout";
import process from "process";
import Profile from "./Profile";
import Alert from "./Alert";
import placeholder from "./assets/placeholder.jpeg"
import { useAuth0 } from "@auth0/auth0-react";

window.process = process;

function App() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const getUploadedImage = localStorage.getItem("uploadedImage");
   
  const { isAuthenticated } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();


  useEffect(() => {
    setIsButtonDisabled(inputValue.trim().length === 0);
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    // Fetch the list of available models
    // if isAuthenicated then fetch available models
    if (isAuthenticated) {
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
    }
  });
  return (
    <>
      <div className="nav-header">
        <h1>🟰 Math Solver ➕</h1>
        <div className="login-container">
          <Login />
          <Logout />
          <Profile />
        </div>
      </div>

      {isAuthenticated && (
        <div className="workarea">
          <div className="upload">
            <p></p>
            <div>
              <Form.Group  className="mb-3">
                  <Form.Control
                    type="file"
                    name="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
              </Form.Group>
             </div>
          </div> 
          <div className="canvas">
            <img
              src={placeholder}
              alt="placeholder"
              id="uploadedImage"
            />
          </div>

          <div className="chat">
            <div id="conversation"></div>

            <div className="add-image-container">
              <input type="checkbox" name="add-image" id="add-image" />
              <label htmlFor="add-image">Add Image</label>
              <div className="model-selection">
                <label htmlFor="model-select"></label>
                <select id="model-select" name="model-select"></select>
              </div>
            </div>

            <div className="message-box">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="input-message"
                placeholder="Type your message"
                id="input-message"
              /> 
              <Button
                id="btn-message-send"
                type="submit"
                disabled={loading || isButtonDisabled}
                onClick={async () => {
                  setLoading(true);
                  const token = await getAccessTokenSilently();
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
                  // Check if the image checkbox is checked and an image is uploaded
                  if (
                    addImageCheckbox.checked &&
                    !getUploadedImage
                  ) {
                    // Show an alert or error message
                    setAlertVisible(true);
                    return;
                  }
                  if (inputElement) {
                    handleSendMessage(
                      inputElement.value,
                      addImageCheckbox.checked,
                      selectedModel,
                      token
                    ).finally(() => {
                      setLoading(false);
                      setInputValue(""); // Clear the input field
                    });
                  }
                }}
              >
                {loading ? "..." : "Send"}
              </Button>
              { alertVisible && <Alert message={"Test"} type={"error"}></Alert>}

            </div>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="warning">
          <p>Please contact the admin :)</p>
        </div>
      )}
    </>
  );
}

// Fetch the list of available models from an API or local data source
async function fetchAvailableModels() {
  // Replace this with your actual API call or data source
  const models = [
    { id: "gpt-4o", name: "gpt-4o" },
    { id: "claude-3-5-sonnet-20240620", name: "claude-3-5-sonnet-20240620" },
  ];
  return models;
}

export default App;
