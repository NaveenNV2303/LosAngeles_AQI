document
  .getElementById("predictBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const date = document.getElementById("datepicker").value;
    const apiUrl = document.getElementById("api-url").value;
    const API_URL = apiUrl || "http://127.0.0.1:5000/predict";
    if (date) {
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let sentimentClass = "";
          if (data.error) {
            document.getElementById("aqi-moderate").innerHTML = `${data.error}`;
            sentimentClass = "moderate";
          } else {
            const aqi = parseFloat(data.predicted_aqi).toFixed(2);
            if (aqi > 300) {
              sentimentClass = "hazardous";
            } else if (aqi > 200) {
              sentimentClass = "very-unhealthy";
            } else if (aqi > 150) {
              sentimentClass = "unhealthy";
            } else if (aqi > 100) {
              sentimentClass = "bad";
            } else if (aqi > 50) {
              sentimentClass = "moderate";
            } else {
              sentimentClass = "good";
            }

            const cards = Array.from(document.querySelectorAll(".card"));
            for (const card of cards) {
              card.classList.remove("hidden");
            }

            const cardsToHide = cards.filter(
              (card) => !card.classList.contains(`card-${sentimentClass}`)
            );
            for (const card of cardsToHide) {
              card.classList.add("hidden");
            }

            // Update the result text to id aqi-{sentimentClass} with aqi value
            document.getElementById(
              `aqi-${sentimentClass}`
            ).innerHTML = `${aqi}`;
          }
        })
        .catch((error) => {
          document.getElementById(
            "aqi-moderate"
          ).innerHTML = `<span class="bad">Error: ${error.message}</span>`;
        });
    }
  });
