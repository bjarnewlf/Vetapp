import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Welcome from "./screens/Welcome";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import MyPets from "./screens/MyPets";
import AddPet from "./screens/AddPet";
import PetProfile from "./screens/PetProfile";
import AddVaccination from "./screens/AddVaccination";
import Treatments from "./screens/Treatments";
import AddTreatment from "./screens/AddTreatment";
import Reminders from "./screens/Reminders";
import AddReminder from "./screens/AddReminder";
import VetContact from "./screens/VetContact";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";
import PremiumAI from "./screens/PremiumAI";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/app",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "pets", Component: MyPets },
      { path: "add-pet", Component: AddPet },
      { path: "pet/:petId", Component: PetProfile },
      { path: "pet/:petId/add-vaccination", Component: AddVaccination },
      { path: "pet/:petId/treatments", Component: Treatments },
      { path: "pet/:petId/add-treatment", Component: AddTreatment },
      { path: "reminders", Component: Reminders },
      { path: "add-reminder", Component: AddReminder },
      { path: "vet-contact", Component: VetContact },
      { path: "profile", Component: Profile },
      { path: "edit-profile", Component: EditProfile },
      { path: "premium-ai", Component: PremiumAI },
    ],
  },
]);