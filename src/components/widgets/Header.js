import React from "react";

export const Header = ({scrollTobuynow}) => {
  return (
    <>
      
      <header className="home" id="home">
        
        <div className="banner_content">
          <div className="container  position-relative">
           
            <div className="row">
              <div className="col-md-12 m-auto text-center">
                <p>INTRODUCING</p>
                <h1>
                Gas Wizard 
                </h1>
                <p className=" mt-3 mt-md-4">
                Savings for every drive
                </p>
                <div className="login_btns mt-4">
                  <a href="/#buy-now" className="btn btn2 pl-md-5 pr-md-5" onClick={scrollTobuynow}>
                  Buy $GWIZ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
