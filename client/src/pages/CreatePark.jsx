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

  const isOptionDisabled = (category, value) => {
    if (!park.is_family_friendly) return false;
    const nonFamilyOptions = {
      ride: ["hypercoaster"],
      food: ["barbites"],
      attraction: ["shooting", "casino"],
    };
    return nonFamilyOptions[category]?.includes(value) || false;
  };

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
      </center>
      <form onSubmit={createPark}>
        {" "}
        {/* ← added onSubmit */}
        {/* Name */}
        <label>Name</label> <br />
        <input
          type="text"
          id="name"
          name="park_name" // ← changed to match state key
          value={park.park_name}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        {/* Family Friendly checkbox – name fixed to "is_family_friendly" */}
        <input
          type="checkbox"
          id="family_friendly"
          name="is_family_friendly" // ← changed to match state
          checked={park.is_family_friendly}
          onChange={handleChange}
        />
        <label>Family Friendly?</label>
        <br />
        <br />
        {/* Ride */}
        <label>Main Ride</label> <br />
        <select
          id="ride"
          name="ride"
          value={park.ride}
          onChange={handleChange}
          required
        >
          <option value="">Select a ride</option>
          <option
            value="hypercoaster"
            disabled={isOptionDisabled("ride", "hypercoaster")}
          >
            Hypercoaster{" "}
            {isOptionDisabled("ride", "hypercoaster") &&
              "(Not family friendly)"}
          </option>
          <option
            value="ferriswheel"
            disabled={isOptionDisabled("ride", "ferriswheel")}
          >
            Ferris Wheel
          </option>
          <option
            value="carousel"
            disabled={isOptionDisabled("ride", "carousel")}
          >
            Carousel
          </option>
          <option
            value="logflume"
            disabled={isOptionDisabled("ride", "logflume")}
          >
            Log Flume{" "}
            {isOptionDisabled("ride", "logflume") && "(Not family friendly)"}
          </option>
        </select>
        <br />
        <br />
        {/* Food */}
        <label>Food Offerings</label> <br />
        <select
          id="food"
          name="food"
          value={park.food}
          onChange={handleChange}
          required
        >
          <option value="">Select food</option>
          <option
            value="classics"
            disabled={isOptionDisabled("food", "classics")}
          >
            Fair Food
          </option>
          <option
            value="barbites"
            disabled={isOptionDisabled("food", "barbites")}
          >
            Alcohol and Bar Bites{" "}
            {isOptionDisabled("food", "barbites") && "(Not family friendly)"}
          </option>
          <option value="hype" disabled={isOptionDisabled("food", "hype")}>
            Hype Food
          </option>
          <option value="fancy" disabled={isOptionDisabled("food", "fancy")}>
            Food Festival
          </option>
        </select>
        <br />
        <br />
        {/* Attraction */}
        <label>Additional Attraction</label> <br />
        <select
          id="attraction"
          name="attraction"
          value={park.attraction}
          onChange={handleChange}
          required
        >
          <option value="">Select an attraction</option>
          <option
            value="shooting"
            disabled={isOptionDisabled("attraction", "shooting")}
          >
            Shooting Range{" "}
            {isOptionDisabled("attraction", "shooting") &&
              "(Not family friendly)"}
          </option>
          <option
            value="casino"
            disabled={isOptionDisabled("attraction", "casino")}
          >
            Casino{" "}
            {isOptionDisabled("attraction", "casino") &&
              "(Not family friendly)"}
          </option>
          <option
            value="aquarium"
            disabled={isOptionDisabled("attraction", "aquarium")}
          >
            Aquarium
          </option>
          <option
            value="mascots"
            disabled={isOptionDisabled("attraction", "mascots")}
          >
            Mascot Meet and Greet
          </option>
        </select>
        <br />
        <br />
        {/* Total Price */}
        <label>Total Cost</label> <br />
        <input
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
    </div>
  );
};

export default CreatePark;
