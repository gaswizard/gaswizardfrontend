import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
export const Navbar = ({
  scrollToHome,
  scrollToAbout,
  scrollToTokenomics,
  scrollToApp,
  scrollToFaq,
  scrollToRoadmap,
  scrollTobuynow,
}) => {
  const { authenticated } = useAuth();

  return (
    <>
      {/* <div class="box bs_box">
         
        {authenticated ? (
          ""
        ) : (
          <>
            
            <Link to="/sign-up" class="btn btn_border ">
              Sign up
            </Link>
          </>
        )}
      </div> */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <div className="nav_box">
            <a className="navbar-brand" href="/">
              <img src="/img/logo.svg" alt="Gas Wizard Logo" className="logo" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarText"
            >
              <span className="icon-bar">
                <i className="bi bi-justify" />
              </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav ml-auto line">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/#about-us"
                    onClick={scrollToAbout}
                  >
                   AI Gas Prediction
                  </a>
                </li>
              
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="https://github.com/Coinsult/solidity/blob/main/Coinsult_GasWizard_0x22...f4fc_Audit.pdf"
                    target="_blank"
                  >
                    Audit
                  </a>
                </li>
{/* 
                <div onClick={scrollToFaq}>
                  <li className="nav-item">
                    <a className="nav-link" href="/#faq" onClick={scrollToFaq}>
                      FAQ
                    </a>
                  </li>
                </div> */}
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/#roadmap"
                    onClick={scrollToRoadmap}
                  >
                    Roadmap
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/#tokenomics"
                    onClick={scrollToTokenomics}
                  >
                    Tokenomics
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/#app"
                    onClick={scrollToApp}
                  >
                    App
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="https://gaswizard.gitbook.io/gaswizard-ai-whitepaper/"
                    target="_blank"
                    // onClick={scrollToApp}
                  >
                    Whitepaper
                  </a>
                </li>
                
              </ul>
            </div>
            {/* <div className="mo_none">
              <a
                className="btn btn_border"
                target="_blank"
                href="https://gaswizard.gitbook.io/gas-wizard-whitepaper/"
              >
                Whitepaper
              </a>

              <a className="btn ml-3" href="/#buy-now" onClick={scrollTobuynow}>
                Buy Now
              </a>

              <a className="btn ml-3" href="/buy-crypto">
                How to buy
              </a>
             
            </div> */}
          </div>
        </div>
      </nav>
    </>
  );
};
