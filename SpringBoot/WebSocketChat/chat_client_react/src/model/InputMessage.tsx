import OutputMessage from "./OutputMessage";

/**En este caso este es la estructura de menaje que recibira nuestro cliente */
export default interface InputMessage extends OutputMessage {
   time?: string;
}
