import { BufferMemory } from "langchain/memory";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic, AnthropicInput } from "@langchain/anthropic";
import { ConversationChain } from "langchain/chains";
import { Redis } from "@upstash/redis";
import { HumanMessage } from "@langchain/core/messages";
import Anthropic from "@anthropic-ai/sdk";
import process from "process";

interface ExtendedAnthropicInput extends AnthropicInput {
  dangerouslyAllowBrowser?: boolean;
}
// Initialize Redis client
const client = new Redis({
  url: import.meta.env.VITE_UPSTASH_URL,
  token: import.meta.env.VITE_UPSTASH_TOKEN,
});

// Create a unique session ID for the conversation
const sessionId = new Date().toISOString();

// Initialize memory
const memory = new BufferMemory({
  chatHistory: new UpstashRedisChatMessageHistory({
    sessionId: sessionId,
    sessionTTL: 3600, // 1 hour
    client,
  }),
});

// Initialize the model and chain
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const openaiModels = ["gpt-4o-mini"];
const claudeModels = ["claude-3-5-sonnet-20240620"];

// Function to check the model type
function isModelType(modelName: string): unknown {
  if (openaiModels.includes(modelName)) {
    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0,
      apiKey: OPENAI_API_KEY,
    });
    return model;
  } else if (claudeModels.includes(modelName)) {
    const model = new ChatAnthropic({
      baseURI: "http://localhost:5002",
      model: "claude-3-5-sonnet-20240620",
      temperature: 0,
    } as ExtendedAnthropicInput);
    return model;
  } else {
    return "Unknown Model";
  }
}

export const handleSendMessage = async (
  message: string,
  imageCheck: boolean,
  selectedModel: string
) => {
  if (
    !openaiModels.includes(selectedModel) &&
    !claudeModels.includes(selectedModel)
  ) {
    console.error("Invalid model selected");
    return;
  }

  const model = isModelType(selectedModel);

  console.log("Image Check:", imageCheck);
  // Clear the input field after sending the message

  const userInput = document.getElementById("input-message");
  if (userInput) {
    (userInput as HTMLInputElement).value = "";
  }

  // Add the user message to the chat history
  const conversationElement = document.getElementById("conversation");

  if (conversationElement) {
    // Create a new div element for the user message
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
    const messageContent: any[] = [
      {
        type: "text",
        text: message,
      },
    ];

    const uploadedImageUrl = localStorage.getItem("uploadedImage");

    if (imageCheck) {
      messageContent.push({
        type: "image_url",
        image_url: {
          url: uploadedImageUrl,
        },
      });
    }

    const humanMessage = new HumanMessage({
      content: messageContent,
    });
    const aiMessageDiv = document.createElement("div");

    if (!imageCheck) {
      console.log("Not image");
      const chain = new ConversationChain({ llm: model, memory });
      const response = await chain.predict({ input: message });
      // const response = await chain.invoke({ input: message });
      console.log("Response chat:", response);
      aiMessageDiv.textContent = response;
    } else {
      console.log("Image");

      const response = await model.invoke([humanMessage]);
      console.log("Response chat:", response);
      // render the output as markdown
      let contentString: string;
      if (Array.isArray(response.content)) {
        contentString = response.content
          .map((item) => JSON.stringify(item))
          .join("\n");
      } else {
        contentString = response.content.toString();
      }
      aiMessageDiv.innerText = contentString;
      // aiMessageDiv.textContent = JSON.stringify(response.content);
    }

    if (conversationElement) {
      // Create a new div element for the AI message

      aiMessageDiv.className = "ai-message";

      aiMessageDiv.style.background = "lightgreen";
      aiMessageDiv.style.padding = "10px";
      aiMessageDiv.style.borderRadius = "5px";
      aiMessageDiv.style.margin = "0.25rem";
      aiMessageDiv.style.alignSelf = "flex-start";
      conversationElement.appendChild(aiMessageDiv);
    }
  } catch (error) {
    console.error("Error in conversation:", error);
    // Handle error (e.g., display error message to user)
  }

  // Wait for the response to be returned
  // await new Promise((resolve) => setTimeout(resolve, 5000));
};
