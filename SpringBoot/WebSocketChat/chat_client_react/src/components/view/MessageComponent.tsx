import "../../css/MessageComponent.css";
import MessageComponentProps from "../../model/MessageComponentProps";
export default function MessageComponent({
  text,
  time,
  className,
}: MessageComponentProps) {
  const tiempo: string = new Date().toDateString();
  return (
    <div className={["mb-3", className].join(" ")}>
      <div className="input-group message">
        <div
          className="form-control"
          id="basic-url"
          aria-describedby="basic-addon3"
        >
          {text}
        </div>
      </div>
      <div className="form-text">{time ? time : tiempo}</div>
    </div>
  );
}
