import React, { useState, useEffect } from "react";
import "../App.css";
import { parkPrices } from "../utilities/prices";

const FAMILY_IMAGE =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjR6-gWOs8H115z9UdqcmM_Y4YlEVkEroFP4V3hIIoPpitFXC5IMkH2eD6IuyEzuiI0fSnltzy4ylXpatj7DURkDq9dw3MERcAU0wmSRiqoD0g4PYKOyKz9A-BomdMND29yA0FkgTvaSn_R/s600/bg_oshiro_castle.jpg";
const ADVENTURE_IMAGE =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjac4gaFat7iZyXOLwHB0Oi-RgOkj8MPU3By3EcQ_CiZIfmHMj2FtUdNmD976JrOiexXc_Jo8Ge9MPJix9tcMYOPeEGJpZodovHMDURWJfKIesGlv-TF7KjtPbVgquYTqswB4C4g8I494e5/s400/rollercoaster.png";

const CreatePark = () => {
  const [park, setPark] = useState({
    id: 0,
    park_name: "",
    is_family_friendly: false,
    ride: "",
    food: "",
    attraction: "",
    total_price: 0,
    img_url: ADVENTURE_IMAGE,
  });

  const getPriceKey = (category, value) => {
    const mappings = {
      ride: {
        hypercoaster: "hypercoaster",
        ferriswheel: "ferris_wheel",
        carousel: "carousel",
        logflume: "log_flume",
      },
      food: {
        classics: "classic_fair",
        barbites: "alcohol_bar",
        hype: "food_festival",
        fancy: "food_festival",
      },
      attraction: {
        shooting: "shooting_range",
        casino: "casino",
        aquarium: "aquarium",
        mascots: "mascot_meet",
      },
    };
    return mappings[category]?.[value] || value;
  };

  const calculateTotal = (ride, food, attraction) => {
    let total = 0;
    const rideKey = getPriceKey("ride", ride);
    const foodKey = getPriceKey("food", food);
    const attractionKey = getPriceKey("attraction", attraction);

    if (rideKey && parkPrices.rides[rideKey])
      total += parkPrices.rides[rideKey];
    if (foodKey && parkPrices.food[foodKey]) total += parkPrices.food[foodKey];
    if (attractionKey && parkPrices.attractions[attractionKey])
      total += parkPrices.attractions[attractionKey];
    return total;
  };

  // Recalculate total when selections change
  useEffect(() => {
    const total = calculateTotal(park.ride, park.food, park.attraction);
    setPark((prev) => ({ ...prev, total_price: total }));
  }, [park.ride, park.food, park.attraction]);

  // Fixed handleChange: properly handles checkbox and text/select inputs
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // For checkboxes, use 'checked'; for others, use 'value'
    const newValue = type === "checkbox" ? checked : value;

    if (name === "is_family_friendly") {
      // When toggling family-friendly, also update the image
      setPark((prev) => ({
        ...prev,
        is_family_friendly: checked,
        img_url: checked ? FAMILY_IMAGE : ADVENTURE_IMAGE,
      }));
    } else {
      // For all other fields, update normally
      setPark((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  // createPark must be async because we use await
  const createPark = async (event) => {
    event.preventDefault();

    // Validate
    if (!park.park_name.trim()) {
      alert("Please enter a park name");
      return;
    }
    if (!park.ride) {
      alert("Please select a ride");
      return;
    }
    if (!park.food) {
      alert("Please select food offerings");
      return;
    }
    if (!park.attraction) {
      alert("Please select an attraction");
      return;
    }

    // Add this validation block after the existing checks
    if (park.is_family_friendly) {
      const nonFamilyRides = ["hypercoaster"];
      const nonFamilyFoods = ["barbites"];
      const nonFamilyAttractions = ["shooting", "casino"];

      if (nonFamilyRides.includes(park.ride)) {
        alert("⚠️ Hypercoaster is not suitable for a family friendly park!");
        return;
      }
      if (nonFamilyFoods.includes(park.food)) {
        alert(
          "⚠️ Alcohol and Bar Bites is not suitable for a family friendly park!",
        );
        return;
      }
      if (nonFamilyAttractions.includes(park.attraction)) {
        alert("⚠️ That attraction is not suitable for a family friendly park!");
        return;
      }
    }

    try {
      const response = await fetch("/api/parks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(park),
      });

      if (response.ok) {
        window.location = "/";
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create park. Please try again.");
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  return (
    <div className="CreatePark">
      <center>
        <h2>Add a Park</h2>

        <form onSubmit={createPark}>
          {" "}
          {/* Name */}
          <label>Name</label> <br />
          <input
            className="form-field"
            type="text"
            id="name"
            name="park_name"
            value={park.park_name}
            onChange={handleChange}
            required
          />
          <br />
          <br />
          <input
            type="checkbox"
            id="family_friendly"
            name="is_family_friendly"
            checked={park.is_family_friendly}
            onChange={handleChange}
          />
          <label>Family Friendly?</label>
          <br />
          <br />
          <label>Main Ride</label> <br />
          <select
          className="form-field"
            id="ride"
            name="ride"
            value={park.ride}
            onChange={handleChange}
            required
          >
            <option value="">Select a ride</option>
            <option value="hypercoaster">Hypercoaster</option>
            <option value="ferriswheel">Ferris Wheel</option>
            <option value="carousel">Carousel</option>
            <option value="logflume">Log Flume </option>
          </select>
          <br />
          <br />
          <label>Food Offerings</label> <br />
          <select
            className="form-field"
            id="food"
            name="food"
            value={park.food}
            onChange={handleChange}
            required
          >
            <option value="">Select food</option>
            <option value="classics">Fair Food</option>
            <option value="barbites">Alcohol and Bar Bites </option>
            <option value="hype">Hype Food</option>
            <option value="fancy">Food Festival</option>
          </select>
          <br />
          <br />
          <label>Additional Attraction</label> <br />
          <select
          className="form-field"
            id="attraction"
            name="attraction"
            value={park.attraction}
            onChange={handleChange}
            required
          >
            <option value="">Select an attraction</option>
            <option value="shooting">Shooting Range</option>
            <option value="casino">Casino</option>
            <option value="aquarium">Aquarium</option>
            <option value="mascots">Mascot Meet and Greet</option>
          </select>
          <br />
          <br />
          <label>Total Cost</label> <br />
          <input
          className="form-field"
            type="text"
            id="total_price"
            name="total_price"
            value={`$${park.total_price.toLocaleString()}`}
            readOnly
            style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}
          />
          <br />
          <br />
          <button type="submit">Create Park</button>
        </form>
      </center>
    </div>
  );
};

export default CreatePark;
