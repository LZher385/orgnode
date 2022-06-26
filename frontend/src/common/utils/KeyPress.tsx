import React, { useState, RefObject } from "react";

const useKeyPress = function (
  targetKey: string
  // ref: RefObject<HTMLInputElement>
) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }: { key: string }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    // ref.current?.addEventListener("keydown", downHandler);
    // ref.current?.addEventListener("keyup", upHandler);
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      // ref.current?.removeEventListener("keydown", downHandler);
      // ref.current?.removeEventListener("keyup", upHandler);
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

export default useKeyPress;
