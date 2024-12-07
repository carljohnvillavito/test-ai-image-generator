document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("prompt");
  const messageDiv = document.getElementById("message");
  const imageContainer = document.getElementById("imageContainer");

  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      showMessage("Please enter a prompt!", "error");
      return;
    }

    try {
      showMessage("Generating image, please wait...", "info");
      imageContainer.innerHTML = ""; // Clear previous content

      const response = await axios.get(`/api/image?prompt=${encodeURIComponent(prompt)}`);

      if (response.data.status === "success") {
        const { message, data } = response.data;
        showMessage(message, "success");

        // Display each image and add a download button
        for (const url of data.images) {
          const img = document.createElement("img");
          img.src = url;
          img.alt = `Generated image for prompt: ${data.prompt}`;
          imageContainer.appendChild(img);

          // Download button
          const downloadBtn = document.createElement("button");
          downloadBtn.className = "download-btn";
          downloadBtn.textContent = "Download Image";

          downloadBtn.addEventListener("click", async () => {
            await downloadImage(url, `generated-image-${data.prompt}.jpg`);
          });

          imageContainer.appendChild(downloadBtn);
        }
      } else {
        showMessage("Failed to generate image. Try again.", "error");
      }
    } catch (error) {
      console.error(error);
      showMessage("An error occurred while fetching the image.", "error");
    }
  });

  async function downloadImage(imageUrl, fileName) {
    try {
      const response = await axios.get(imageUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download image:", error);
      showMessage("Failed to download the image.", "error");
    }
  }

  function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${type}`;
  }
});
