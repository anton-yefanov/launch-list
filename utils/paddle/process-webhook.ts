import { EventEntity } from "@paddle/paddle-node-sdk";

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    console.log(eventData);
  }
}
