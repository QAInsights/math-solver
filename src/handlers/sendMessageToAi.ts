import axios from "axios";

const openaiModels = ["gpt-4o"];
const claudeModels = ["claude-3-5-sonnet-20240620"];

// Set up CORS configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Function to handle CORS preflight requests
export const handleCors = (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
};

let conversation = [];
let anthropicConversation = [];

export const handleSendMessage = async (
  message: string,
  imageCheck: boolean,
  selectedModel: string
) => {
  console.log("Selected Model:", selectedModel);
  console.log("Image Check:", imageCheck);
  console.log("Message:", message);

  const g = getToken();
  console.log("Token:", g);

  if (
    !openaiModels.includes(selectedModel) &&
    !claudeModels.includes(selectedModel)
  ) {
    console.error("Invalid model selected");
    return;
  }

  console.log("Image Check:", imageCheck);

  // Get a token from auth0 to authorize the request

  // Clear the input field after sending the message
  const userInput = document.getElementById("input-message");
  if (userInput) {
    (userInput as HTMLInputElement).value = "";
  }

  // Add the user message to the chat history
  const conversationElement = document.getElementById("conversation");
  if (conversationElement) {
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "user-message";
    userMessageDiv.textContent = message;
    userMessageDiv.style.background = "lightblue";
    userMessageDiv.style.padding = "10px";
    userMessageDiv.style.borderRadius = "5px";
    userMessageDiv.style.margin = "0.25rem";
    userMessageDiv.style.alignSelf = "flex-end";
    conversationElement.appendChild(userMessageDiv);
  }

  try {
    let baseURL = import.meta.env.VITE_AI_ENDPOINT;
    console.log(baseURL);
    const uploadedImageUrl = localStorage.getItem("uploadedImage");

    if (selectedModel === "gpt-4o") {
      baseURL = import.meta.env.VITE_AI_ENDPOINT + "/api/hello";
      console.log("Base url", baseURL);

      if (imageCheck) {
        conversation.push({
          role: "user",
          content: [
            {
              type: "text",
              text: message,
            },
            {
              type: "image_url",
              image_url: { url: uploadedImageUrl },
            },
          ],
        });
      } else {
        conversation.push({
          role: "user",
          content: message,
        });
      }
    }
    if (selectedModel === "claude-3-5-sonnet-20240620") {
      baseURL = baseURL + "/api/anthropic";
      console.log("Base url", baseURL);

      if (imageCheck) {
        const { imageType, base64Image } = extractBase64Image();
        anthropicConversation.push({
          role: "user",
          content: [
            {
              type: "text",
              text: message,
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageType,
                data: base64Image,
              },
            },
          ],
        });
      } else {
        anthropicConversation.push({
          role: "user",
          content: message,
        });
      }
    }

    const finalConversation =
      selectedModel === "claude-3-5-sonnet-20240620"
        ? anthropicConversation
        : conversation;

    console.log(finalConversation);

    console.log(
      JSON.stringify({
        input: finalConversation,
        selectedModel: selectedModel,
      })
    );

    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add the Authorization header with the token
        // Authorization: `Bearer `,
      },

      body: JSON.stringify({
        input: finalConversation,
        selectedModel: selectedModel,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await response.json();
    console.log(data);

    if (selectedModel === "claude-3-5-sonnet-20240620") {
      data = data.message[0].text;
      anthropicConversation.push({
        role: "assistant",
        content: data,
      });
    } else if (selectedModel === "gpt-4o") {
      data = data.message;
      conversation.push({
        role: "assistant",
        content: data,
      });
    }

    // Display the AI response
    const aiMessageDiv = document.createElement("div");
    aiMessageDiv.className = "ai-message";
    aiMessageDiv.textContent = data;
    aiMessageDiv.style.background = "lightgreen";
    aiMessageDiv.style.padding = "10px";
    aiMessageDiv.style.borderRadius = "5px";
    aiMessageDiv.style.margin = "0.25rem";
    aiMessageDiv.style.alignSelf = "flex-start";

    if (conversationElement) {
      conversationElement.appendChild(aiMessageDiv);
    }

    // Scroll to the bottom of the conversation
    if (conversationElement) {
      conversationElement.scrollTop = conversationElement.scrollHeight;
    }
  } catch (error) {
    console.error("Error in conversation:", error);
    // Handle error (e.g., display error message to user)
  }
};
function extractBase64Image() {
  const uploadedImage = localStorage.getItem("uploadedImage");
  if (uploadedImage) {
    const base64Image = uploadedImage.replace("data:image/png;base64,", "");
    const imageType = uploadedImage.split(";")[0].split(":")[1];

    return { imageType, base64Image };
  }
  throw new Error("No uploaded image found.");
}

async function getToken() {

  var options = {
    method: 'POST',
    url: 'https://dev-24.us.auth0.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: import.meta.env.VITE_OAUTH_API_CLIENT_ID,
      client_secret: import.meta.env.VITE_OAUTH_API_CLIENT_SECRET,
      audience: import.meta.env.VITE_OAUTH_API_AUDIENCE
    })
  };

  const response = await axios.request(options);
  console.log(response.data);
}
