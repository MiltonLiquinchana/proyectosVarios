import IWebSocketService from "../service/IWebSocketService";
import * as webstomp from "webstomp-client";
import OutputMessage from "../model/OutputMessage";
import MessageComponent from "../components/view/MessageComponent";
import InputMessage from "../model/InputMessage";
import OutputNotify from "../model/OutputNotify";
interface MyComponent {
  setMessages: Function;
}

export default class WebSocketService implements IWebSocketService {
  private client: webstomp.Client | null;
  private setMessages: Function;
  private options = {
    debug: true,
    reconnect_delay: 5000,
  };

  constructor(setMessages: Function) {
    this.client = null;
    this.setMessages = setMessages;
  }

  /**funcion que realiza la conexion al servidor websocket */
  connect(myUser: string): void {
    this.client = webstomp.over(new WebSocket("ws://localhost:8080/ws"));
    // this.client = webstomp.client("ws://localhost:8080/server");
    this.client.connect(
      {},
      (frame) => {
        console.log(`Connected: ${frame}`);

        /*Al registrarnos con el método subscribe en la ruta por la cual el servidor nos
         envía el mensaje, también le adjuntamos el usuario con el cual nos vamos a registrar */
        this.onMessage(myUser);
        /**Registramos para escuchar notificaciones de escritura */
        this.onNotify(myUser);
      },
      (error) => {
        console.log("Ocurrió un problema, conectando en 10 segundos");
        setTimeout(() => {
          this.connect(myUser);
        }, 10000);
      }
    );
  }

  /**función que sirve para desconectar del servidor websocket */
  disconnect(): void {
    if (this.client) {
      this.client.disconnect();
    }
  }

  /**Funcion que sirve para enviar mensajes a un usuario */
  send(message: OutputMessage): void {
    console.log("Enviando...");
    if (!this.client) {
      return;
    }
    this.client.send(`/app/hello`, JSON.stringify(message), {
      "Content-Type": "application/json",
    });
    this.createMessage(message, "message-group-right");
  }

  sendNotify(notify: OutputNotify): void {
    console.log("Notificando...");
    if (!this.client) {
      return;
    }
    this.client.send(`/app/notify`, JSON.stringify(notify), {
      "Content-Type": "application/json",
    });
  }

  onMessage(myUser: string): void {
    if (!this.client) {
      return;
    }
    /**Para recordar en el servidor definimos dos endpoints uno para usarios, es decir para
     * comunicaciones privadas, y otro para un chat General
     */
    this.client.subscribe(`/user/${myUser}/queue/messages`, (message) => {
      this.createMessage(JSON.parse(message.body), "");
    });
  }
  onNotify(myUser: string): void {
    if (!this.client) {
      return;
    }
    /**Para recordar en el servidor definimos dos endpoints uno para usarios, es decir para
     * comunicaciones privadas, y otro para un chat General
     */
    this.client.subscribe(`/user/${myUser}/queue/notify`, (notify) => {
      console.log(notify.body);
    });
  }

  createMessage(message: InputMessage, className: string): void {
    this.setMessages((lista: JSX.Element[]) => {
      return [
        ...lista,
        <MessageComponent
          from={message.from}
          text={message.text}
          to={message.to}
          key={lista.length + 1}
          className={className}
        />,
      ];
    });
  }
}
