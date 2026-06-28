import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
import { parkPrices } from "../utilities/prices";
import { getPark, updatePark } from "../services/api.jsx";

const FAMILY_IMAGE =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjR6-gWOs8H115z9UdqcmM_Y4YlEVkEroFP4V3hIIoPpitFXC5IMkH2eD6IuyEzuiI0fSnltzy4ylXpatj7DURkDq9dw3MERcAU0wmSRiqoD0g4PYKOyKz9A-BomdMND29yA0FkgTvaSn_R/s600/bg_oshiro_castle.jpg";
const ADVENTURE_IMAGE =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjac4gaFat7iZyXOLwHB0Oi-RgOkj8MPU3By3EcQ_CiZIfmHMj2FtUdNmD976JrOiexXc_Jo8Ge9MPJix9tcMYOPeEGJpZodovHMDURWJfKIesGlv-TF7KjtPbVgquYTqswB4C4g8I494e5/s400/rollercoaster.png";

const EditPark = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // Fetch the park data when the component mounts or when id changes
  useEffect(() => {
    const fetchPark = async () => {
      try {
        const response = await fetch(`/api/parks/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Set the park state with the fetched data
          // Also recalculate total to be safe
          setPark({
            ...data,
            total_price: calculateTotal(data.ride, data.food, data.attraction),
          });
        } else {
          alert("Park not found");
          navigate("/"); // redirect to home
        }
      } catch (error) {
        alert("Error fetching park: " + error.message);
      }
    };
    fetchPark();
  }, [id, navigate]);

  // Recalculate total when selections change (same effect as CreatePark)
  useEffect(() => {
    const total = calculateTotal(park.ride, park.food, park.attraction);
    setPark((prev) => ({ ...prev, total_price: total }));
  }, [park.ride, park.food, park.attraction]);

  // Handle form changes (identical to CreatePark)
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "is_family_friendly") {
      setPark((prev) => ({
        ...prev,
        is_family_friendly: checked,
        img_url: checked ? FAMILY_IMAGE : ADVENTURE_IMAGE,
      }));
    } else {
      setPark((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation (same as create)
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
      await updatePark(id, park);
      navigate("/customparks");
    } catch (error) {
      alert("Failed to update park: " + error.message);
    }
  };

  return (
    <div className="EditPark">
      <center>
        <h2>Edit Park</h2> {/* changed title */}
        <form onSubmit={handleSubmit}>
          {" "}
          <label>Name</label> <br />
          <input
            className="form-field"
            type="text"
            name="park_name"
            value={park.park_name}
            onChange={handleChange}
            required
          />
          <br />
          <br />
          {/* Family Friendly checkbox */}
          <input
            type="checkbox"
            name="is_family_friendly"
            checked={park.is_family_friendly}
            onChange={handleChange}
          />
          <label>Family Friendly?</label>
          <br />
          <br />
          {/* Ride */}
          <label>Main Ride</label> <br />
          <select
            className="form-field"
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
          {/* Food */}
          <label>Food Offerings</label> <br />
          <select
            className="form-field"
            name="food"
            value={park.food}
            onChange={handleChange}
            required
          >
            <option value="">Select food</option>
            <option value="classics">Fair Food</option>
            <option value="barbites">Alcohol and Bar Bites</option>
            <option value="hype">Hype Food</option>
            <option value="fancy">Food Festival</option>
          </select>
          <br />
          <br />
          {/* Attraction */}
          <label>Additional Attraction</label> <br />
          <select
            className="form-field"
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
          {/* Total Price */}
          <label>Total Cost</label> <br />
          <input
            className="form-field"
            type="text"
            value={`$${park.total_price.toLocaleString()}`}
            readOnly
            style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}
          />
          <br />
          <br />
          <button type="submit">Update Park</button> {/* changed label */}
        </form>
      </center>
    </div>
  );
};

export default EditPark;
