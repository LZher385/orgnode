import React, { useCallback, useEffect, useState } from "react";
import "./HomePage.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useHotkeys, Options } from "react-hotkeys-hook";
import { ListSharp } from "@mui/icons-material";

type Props = {};

const linksList: { name: string; link: string }[] = [
  { name: "Lists", link: "/lists" },
  { name: "Agenda", link: "" },
  { name: "About", link: "" },
];

const HomePage = (props: Props) => {
  const [index, setIndex] = useState<number>(0);
  let navigate = useNavigate();

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        navigate(linksList[index].link);
      }

      // Prevent default behaviours
      if (event.key === "Tab") {
        event.preventDefault();
      }
    },
    [index, navigate]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const hotkeyOptions: Options = {
    keydown: true,
  };

  useHotkeys(
    "j",
    () => {
      setIndex((prevState) => (prevState < 3 ? prevState + 1 : prevState));
    },
    hotkeyOptions
  );

  useHotkeys(
    "k",
    () => {
      setIndex((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    },
    hotkeyOptions
  );

  return (
    <div className="flex-col h-screen text-center pt-32">
      <pre className="text-doom-blue">
        {`$$$$$$\\                       $$\\   $$\\                 $$\\           
$$  __$$\\                     $$$\\  $$ |                $$ |          
$$ /  $$ | $$$$$$\\   $$$$$$\\  $$$$\\ $$ | $$$$$$\\   $$$$$$$ | $$$$$$\\  
$$ |  $$ |$$  __$$\\ $$  __$$\\ $$ $$\\$$ |$$  __$$\\ $$  __$$ |$$  __$$\\ 
$$ |  $$ |$$ |  \\__|$$ /  $$ |$$ \\$$$$ |$$ /  $$ |$$ /  $$ |$$$$$$$$ |
$$ |  $$ |$$ |      $$ |  $$ |$$ |\\$$$ |$$ |  $$ |$$ |  $$ |$$   ____|
 $$$$$$  |$$ |      \\$$$$$$$ |$$ | \\$$ |\\$$$$$$  |\\$$$$$$$ |\\$$$$$$$\\ 
 \\______/ \\__|       \\____$$ |\\__|  \\__| \\______/  \\_______| \\_______|
                    $$\\   $$ |                                        
                    \\$$$$$$  |                                        
                      \\______/                                         `}
      </pre>
      <section className="mt-24">
        {/* <a className="text-doom-purple mt-8 block">Agenda</a> */}
        {linksList.map((e, idx) => {
          return (
            <Link to={e.link}>
              <h3
                className={`text-doom-purple mt-8 w-1/5 mx-auto block ${
                  index === idx ? "bg-slate-600/50" : ""
                }`}
              >
                {e.name}
              </h3>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default HomePage;
