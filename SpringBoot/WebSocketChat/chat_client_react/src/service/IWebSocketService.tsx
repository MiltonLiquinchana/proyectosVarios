import InputMessage from "../model/InputMessage";
import OutputMessage from "../model/OutputMessage";
import OutputNotify from "../model/OutputNotify";

export default interface IWebSocketService {
  connect(myUser: string): void;
  disconnect(): void;
  send(message: OutputMessage): void;
  sendNotify(notify:OutputNotify): void;
  onMessage(myUser: string): void;
  onNotify(myUser: string): void;
  createMessage(message: InputMessage, className: string): void;
}
