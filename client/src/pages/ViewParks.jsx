import React, { useState, useEffect } from "react";
import "../App.css";
import Card from "../components/Card";
import { getAllParks, deletePark } from "../services/api.jsx";

const ViewParks = () => {
  const [parks, setParks] = useState([]);

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const data = await getAllParks();
        setParks(data);
      } catch (error) {
        console.error("Failed to fetch parks:", error);
      }
    };
    fetchParks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this park?")) {
      try {
        await deletePark(id);
        setParks(parks.filter((park) => park.id !== id));
      } catch (error) {
        alert("Failed to delete park: " + error.message);
      }
    }
  };

  return (
    <div className="parks">
      <main>
        {parks && parks.length > 0 ? (
          parks.map((park) => (
            <Card
              key={park.id}
              id={park.id}
              image={park.img_url}
              name={park.park_name}
              ride={park.ride}
              food={park.food}
              attraction={park.attraction}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <h3 className="noResults">{"No Parks Yet 😞"}</h3>
        )}
      </main>
    </div>
  );
};

export default ViewParks;