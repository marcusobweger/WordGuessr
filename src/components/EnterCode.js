import React, { useState } from "react";

const EnterCode = () => {
  const [code, setCode] = useState("");

  return (
    <div className="container">
      <div className="container page">
        <div className="row">
          <form id="code" className="col">
            <input
              className="inputfield code-inputfield"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              placeholder="enter code"
              autoFocus
              maxLength={20}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
export default EnterCode;
