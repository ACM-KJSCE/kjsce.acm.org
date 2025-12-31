import { Outlet } from "react-router";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import events from "../data/events.json";
export default function Eventpage() {
  const [validEvent, setvalidEvent] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const event = events.find((x) => x.code === params.eventName) || null;
  useEffect(() => {
    if (event) {
      setvalidEvent(true);
    } else {
      navigate("/");
    }
  }, [params]);

  if (validEvent) {
    return <Outlet />;
  }
}
