import dynamic from "next/dynamic";
import { useState } from "react";
const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
    ssr: false,
  });
  
  function  Num() {
    const [num, setNum] = useState(331231);
    return (
      <div className="container">
        {/* <AnimatedNumbers
          includeComma={true}
          className="container"
          animateToNumber={1000}
        /> */}
        <div>
          <button onClick={() => setNum(num+ 31234)}>+</button>
          <button onClick={() => setNum(num - 31234)}>-</button>
        </div>
      </div>
    );
  }
  
  export default Num;