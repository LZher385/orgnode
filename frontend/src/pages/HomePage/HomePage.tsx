import React from "react";
import "./HomePage.scss";
import { Link } from "react-router-dom";

type Props = {};

const HomePage = (props: Props) => {
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
        <a className="text-doom-purple mt-8 block">Agenda</a>
        <Link to="/lists"><h3 className="text-doom-purple mt-8 block">
          Lists</h3></Link>
        <a className="text-doom-purple mt-8 block">About</a>
      </section>
    </div>
  );
};

export default HomePage;
