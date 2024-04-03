import { React, useState, useEffect } from "react";
import "./Eventcard.css";
import { Link } from "react-router-dom";

const Eventpanel = ({ value, index, FocusEvent }) => {
  const [expand, setexpand] = useState(0);
  const handleExpand = (idx) => {
    if (expand === idx) setexpand(null);
    else setexpand(idx);
  };
  var show = expand === index ? true : false;
  if (FocusEvent.includes(index)) {
    show = true;
  }

  const propsHeight = { height: show ? "15rem" : "0px" };
  const propsWidth = { width: show ? "22rem" : "0px" };

  return (
		<div key={index} className="event-data">
			<div onClick={() => handleExpand(index)} className="data-header">
				{value.eventName}
				<p>{value.time}</p>
			</div>

			<div className="data-body">
				<Link to={`/event/${value.eventName}`}>
					<div
						className="img"
						style={{
							display:
								window.innerWidth > 500 || show
									? "contents"
									: "none",
						}}
					>
						<img
							style={
								window.innerWidth <= 500
									? propsHeight
									: propsWidth
							}
							src={`/assets/imgs/home/${value.eventName.slice(0, -3)}.webp`}
							alt="event-icon"
						/>
					</div>
				</Link>
			</div>
		</div>
  );
};

const Eventcard = ({ Eventdata, FocusEvent }) => {
  return (
    <div className="event-card">
      {Eventdata.map((value, index) => (
        <Eventpanel key={index} value={value} index={index} FocusEvent={FocusEvent} />
      ))}
    </div>
  );
};

export default Eventcard;
