import { useEffect, useRef, useState } from "react";
import "../css/ChatClient.css";
import WebSocketService from "../implement/WebSocketService";
import OutputMessage from "../model/OutputMessage";
import userImage from "../image/usuario.svg";
import userPrincipal from "../image/hombre.png";

export default function MyFunctionalComponent() {
  /**Estado para almacenar la instancia a la clase de conexión */
  const [client, setClient] = useState<WebSocketService>();
  /**Este estado lo utilizaremos para hacer que se ejecute el useEffect del scrooll,
   * solo cuando se agrega un elemento al contenedor de mensajes
   */

  /**Establece un estado para almacenar la estructura de mensajes enviados y recibidos,
   * esto hará que cada vez que se actualiza el estado(se agrega un elemento al array),
   * como ya se sabe cada vez que se actualiza el estado el Componente se vuelve a renderisar
   */
  const [messages, setMessages] = useState<JSX.Element[]>([]);

  /** Estado para crear una estructura de mensaje que se envía al servidor*/
  const [form, setForm] = useState<OutputMessage>({
    from: "",
    to: "",
    text: "",
  });

  const scroll = useRef<HTMLDivElement>(null);

  /**Este useEffect se ejecutara cada vez que un elemento es agregado a messages */
  useEffect(() => {
    if (!scroll.current) {
      return;
    }
    console.log("Escroll");
    scroll.current.scrollTo({
      top: scroll.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /**Al dejar el arreglo vació le decimos que este se ejecta una sola ves, este ya no se ejecutara
   * cada ves que se cambie el estado de alguno
   */
  useEffect(() => {
    /**Solo creamos la instancia a WbSocketService una sola vez */
    setClient(new WebSocketService(setMessages));
  }, []);

  /*Función que ejecuta la conexión */
  const handleConnect = () => {
    /**En caso de que no exista la instancia a la clase service */
    if (!client) {
      return;
    }
    /**Conectamos */
    client.connect(form.from);
  };

  /**Función que ejecuta el envió de mensajes */
  const handleSendMessage = () => {
    if (!client) {
      return;
    }
    client.send(form);
  };

  /**Esta función se ejecuta cada vez que hay un cambio en alguno de los input,
   * genera un objeto el cual servirá para enviar el mensaje
   */
  const handleCreateForm = (e: any): void => {
    /**Aquí le decimos que genere una copia del objeto y luego agrega un nuevo campo si no
      existe, si el campo ya existe solo actualiza su valor */
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  /**Función que ejecuta la notificación a los usuario que se escribe */
  const handleNotify = (): void => {
    if (!client) {
      return;
    }
    client.sendNotify(form);
  };

  return (
    <div className="container text-center">
      <div className="row">
        <div className=" container-lateral-menu">
          <div className="row">
            <div className="container-fluid">
              <a className="navbar-brand" href="#/">
                <img
                  src={userPrincipal}
                  alt="UserImage"
                  width="50"
                  height="50"
                />
              </a>

              <div className="dropdown">
                <button
                  className="btn  dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                >
                  <input type="text" name="from" onChange={handleCreateForm} />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={handleConnect}
                    >
                      Open Connection
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" type="button">
                      Close connection
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <ul className="nav flex-column nav-pills nav-fill">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  <img src={userImage} alt="" width="30" height="24" />
                  Active
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <img src={userImage} alt="" width="30" height="24" />
                  Much longer nav link
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <img src={userImage} alt="" width="30" height="24" />
                  Link
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link">
                  <img src={userImage} alt="" width="30" height="24" />
                  Disabled
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col">
          Messages
          <div className="message-container" ref={scroll}>
            {messages.map((mensaje: JSX.Element) => {
              return mensaje;
            })}
          </div>
          <div className="mb-3">
            <textarea
              className="form-control input-message"
              name="text"
              rows={3}
              defaultValue={""}
              onChange={(e) => {
                handleNotify();
                handleCreateForm(e);
              }}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSendMessage}
        >
          Enviar Mensaje
        </button>
      </div>
    </div>
  );
}
