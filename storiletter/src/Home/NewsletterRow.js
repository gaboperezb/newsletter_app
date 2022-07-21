import React from "react";
import { Link } from "react-router-dom";

import './NewsletterRow.css';

function NewsletterRow(props) {
    return (
        <li className="newsletter">
            <Link to={`/newsletter/${props.newsletter._id}`}>
            <div className="newsletter__body">
                <div className="newsletter__text">
                    <h5 className="newsletter__title">{props.newsletter.title}</h5>
                    <p className="newsletter__description">{props.newsletter.description}</p>
                </div>
                <img src="/placeholder_newsletter.png" className="newsletter__img" alt="..." />
            </div>
            </Link>
            
        </li>
    )


}

export default NewsletterRow;