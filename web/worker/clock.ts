// Runs refreshStatus every 5 minutes using this object's alarm.
import { refreshStatus } from "./status";

const EVERY = 5 * 60_000;

export class StatusClock {
  constructor(private state: DurableObjectState, private env: { GAS: KVNamespace }) {}

  async fetch(): Promise<Response> {
    if ((await this.state.storage.getAlarm()) === null) await this.state.storage.setAlarm(Date.now());
    return new Response("ok");
  }

  async alarm(): Promise<void> {
    await this.state.storage.setAlarm(Date.now() + EVERY); // first, so a failed refresh cannot stop the timer
    await refreshStatus(this.env.GAS);
  }
}
