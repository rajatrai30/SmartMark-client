import React, { useRef } from "react";
import { Button } from "antd";
import ReactToPrint from "react-to-print";
import SingleHistory from "./singleHistory";

export default function PrintComponent() {
  let componentRef = useRef();

  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
          trigger={() => <Button>Print this out!</Button>}
          content={() => componentRef}
        />

        {/* component to be printed */}
        <SingleHistory ref={(el) => (componentRef = el)} />
      </div>
    </>
  );
}