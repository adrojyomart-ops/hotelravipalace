const API_URL = "https://script.google.com/macros/s/AKfycbwRUKXpCBzdaDDNdGtulNZrItptEr--woy98VOEQU3g4j1AYYjLJJPE2lc5UMQsczsW/exec";

/* =========================
   LOAD ROOM DATA (COMMON)
========================= */
fetch(API_URL)
  .then(res => res.json())
  .then(data => {

    /* ===== ROOMS PAGE (rooms.html) ===== */
    if (document.getElementById("roomList")) {
      let html = "";

      for (let i = 1; i < data.length; i++) {
        let status = data[i][1] > 0
          ? `<span class="available">Available</span>`
          : `<span class="soldout">Sold Out</span>`;

        html += `
          <div class="room">
            <h3>${data[i][0]}</h3>
            <p>Available Rooms: ${data[i][1]}</p>
            <p>Status: ${status}</p>
          </div>
        `;
      }

      document.getElementById("roomList").innerHTML = html;
    }

    /* ===== BOOKING PAGE (booking.html) ===== */
    if (document.getElementById("roomType")) {
      let select = document.getElementById("roomType");
      select.innerHTML = '<option value="">Select Room Type*</option>';

      for (let i = 1; i < data.length; i++) {
        if (data[i][1] > 0) {
          let opt = document.createElement("option");
          opt.value = data[i][0];
          opt.textContent = data[i][0];
          select.appendChild(opt);
        }
      }
    }
  })
  .catch(err => {
    console.error("API Error:", err);
  });

/* =========================
   BOOKING FORM SUBMIT
========================= */
if (document.getElementById("bookingForm")) {
  document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    if (!roomType.value) {
      alert("Please select a room type");
      return;
    }

    let payload = {
      name: name.value,
      mobile: mobile.value,
      checkin: checkin.value,
      checkout: checkout.value,
      guests: guests.value,
      roomType: roomType.value,
      arrival: arrival.value
    };

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(result => {

        if (result.status === "not_available") {
          alert("Sorry! Selected dates are not available for this room.");
          return;
        }

        let msg = `Hello Hotel Ravi Palace,

Booking Request:
Name: ${payload.name}
Mobile: ${payload.mobile}
Check-in: ${payload.checkin}
Check-out: ${payload.checkout}
Guests: ${payload.guests}
Room Type: ${payload.roomType}
Arrival Time: ${payload.arrival || "Not mentioned"}

Please confirm availability.`;

        window.open(
          "https://wa.me/917409649313?text=" + encodeURIComponent(msg),
          "_blank"
        );
      })
      .catch(err => {
        alert("Booking failed. Please try again.");
        console.error(err);
      });
  });
}
