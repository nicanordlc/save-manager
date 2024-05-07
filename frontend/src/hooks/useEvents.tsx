import { EventsOn } from "@wailsjs/runtime/runtime";
import { useEffect, useState } from "react";

type Events = "quickSave" | "quickLoad";

type UseEventsProps = {
  type: Events;
  cb: () => void | Promise<void>;
};

const useEvents = (props: UseEventsProps) => {
  const { cb } = props;
  const [eventFired, setEventFired] = useState<boolean>(false);

  useEffect(() => {
    if (!eventFired) return;
    setEventFired(true);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    cb();
    setEventFired(false);
  }, [eventFired, cb]);

  EventsOn(props.type, () => {
    setEventFired(true);
  });
};

export default useEvents;
