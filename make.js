document
  .getElementById("invoiceForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const status = document.getElementById("status");
    status.innerText = "Sending...";

    const formData = new FormData(this);
    let data = Object.fromEntries(formData.entries());

    // --- Calculate the tax + total ---
    const subtotal = Number(data.subtotal || 0);
    const taxRate = Number(data.tax || 0) / 100;

    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    // Add new values to payload
    data.taxAmount = taxAmount.toFixed(2);
    data.total = total.toFixed(2);

    // --- Your Make Webhook ---
    const webhookURL =
      "https://hook.us2.make.com/mgj3n3akl1cd4g65nkt7csl2m62ptvef";

    try {
      const res = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        status.innerText = "Submitted! Your invoice will be emailed soon.";
        this.reset();
      } else {
        status.innerText = "Something went wrong.";
      }
    } catch (err) {
      status.innerText = "Network error.";
    }
  });
