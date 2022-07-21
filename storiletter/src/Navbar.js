import React from "react";
import { Link } from "react-router-dom";
import Create from "./Create/Create";
import './Navbar.css';

class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.handleToggleModal = this.handleToggleModal.bind(this);
  }

  
  handleToggleModal(open) {
      this.props.onToggleModal(open);
  }


    render() {
      return (
        <>
         <nav className="nav">
          <Link className="nav__element nav__element--bold" to="/">
            <img className="nav__logo" src="/logo.png"  alt=""/>
          </Link>

          <div className="nav__actions">
          <Link className="nav__element home" to="/">
          Home
          </Link>
          <button className="nav__element user button button--fill" onClick={this.handleToggleModal.bind(this, true)}>
          Create Newsletter
          </button>
          </div>
          
        </nav>
        </>
        
      );
    }
  }

  export default Navbar;