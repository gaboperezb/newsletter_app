import React from "react";
import NewsletterTable from "./NewsletterTable";
import "./Home.css"


class Home extends React.Component {
    constructor(props) {
      super(props);
      
      
      this.handleToggleModal = this.handleToggleModal.bind(this);
      
    }
    
    handleToggleModal() {
      this.props.onToggleModal(true);
  }

    render() {
      const { error, newsletters } = this.props;
      if (error) {
        return <div className="placeholder">Error: {error.message}</div>;
      } else if (newsletters.length) {
        return (
          <div>
            <NewsletterTable newsletters={newsletters}/>
          </div>
        );
      } else {
        return (
          <div className="empty-container">
            <p className="empty-title">You have not created any newsletters yet</p>
            <p className="empty-description"> Create a newsletter to get started</p>
            <div className="btn-container">
            <button onClick={this.handleToggleModal} className="button button--fill empty-btn">Create</button>
            </div>
          </div>
        )
      }
    }
  

  }

  export default Home;

