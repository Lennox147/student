const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Submitting...";

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Registration failed.");

    message.textContent = `Registration successful. Reference ID: ${result.registrationId}`;
    form.reset();
  } catch (error) {
    message.textContent = error.message;
  }
});