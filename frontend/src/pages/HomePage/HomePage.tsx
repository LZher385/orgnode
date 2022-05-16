import React from "react";
import "./HomePage.scss";

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
        <a className="text-doom-purple mt-8 block">Lists</a>
        <a className="text-doom-purple mt-8 block">About</a>
      </section>
    </div>
  );
};

export default HomePage;
