import React from "react";
import { useRoutes } from "react-router-dom";
import Navigation from "./components/Navigation";
import ViewPark from "./pages/ViewParks";
import EditPark from "./pages/EditPark";
import CreatePark from "./pages/CreatePark";
import ParkDetails from "./pages/ParkDetails";
import "./App.css";

const App = () => {
  let element = useRoutes([
    {
      path: "/",
      element: <CreatePark title="Dream Park | Customize" />,
    },
    {
      path: "/customparks",
      element: <ViewPark title="Dream Park | Custom Parks" />,
    },
    {
      path: "/customparks/:id",
      element: <ParkDetails title="Dream Park | View" />,
    },
    {
      path: "/edit/:id",
      element: <EditPark title="Dream Park | Edit" />,
    },
  ]);

  return (
    <div className="app">
      <Navigation />

      {element}
    </div>
  );
};

export default App;
