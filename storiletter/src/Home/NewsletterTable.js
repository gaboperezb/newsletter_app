import React from "react";
import NewsletterRow from "./NewsletterRow";

import './NewsletterTable.css';

function NewsletterTable(props) {

    return (
        <div className="newsletter-table">
            <h1 className="newsletter-table__title">My Newsletters</h1>
            <ul>
                {props.newsletters.map(newsletter => (
                    <NewsletterRow key={newsletter._id} newsletter={newsletter} />))}
            </ul>
        </div>
    )



}

export default NewsletterTable;