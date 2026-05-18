async function sendMessage() {

  // Get input field
  const input = document.getElementById('message')

  // User message
  const message = input.value.trim()

  // Stop empty messages
  if (!message) return

  // Chat container
  const chatBox = document.getElementById('chat-box')

  // Show user message
  chatBox.innerHTML += `
    <div class="message user">
      <strong>You:</strong> ${message}
    </div>
  `

  // Clear input
  input.value = ''

  try {

    // Send message to backend
    const response = await fetch('/chat', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        message
      })

    })

    // Convert response to JSON
    const data = await response.json()

    // Show Gemini response
    chatBox.innerHTML += `
      <div class="message bot">
        <strong>Gemini:</strong> ${data.reply}
      </div>
    `

    // Auto scroll
    chatBox.scrollTop = chatBox.scrollHeight

  } catch (error) {

    chatBox.innerHTML += `
      <div class="message bot">
        Error: Something went wrong
      </div>
    `
  }
}
const uploadForm = document.getElementById("uploadForm");

uploadForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const fileInput = document.getElementById("fileInput");

  const formData = new FormData();

  formData.append(
    "imageFile",
    fileInput.files[0]
  );

  const response = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  console.log(data);

  // Show AI response
  const chatBox = document.getElementById("chat-box");

  chatBox.innerHTML += `
    <div class="bot-message">
      ${data.aiResponse}
    </div>
  `;
});