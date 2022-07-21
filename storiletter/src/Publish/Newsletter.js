import "./Newsletter.css"

function NewsletterBanner(props) {
    return (
        <div className="newsletter-info">
            <div className="newsletter__text">
                <h5 className="newsletter__title">{props.newsletter.title}</h5>
                <p className="newsletter__description">{props.newsletter.description}</p>

                <div className="newsletter__info">
                <p className="newsletter__stat">Newsletters sent</p>
                <p>{props.newsletter.sentEmails}</p>
                <p className="newsletter__stat">Subscribers</p>
                <p>{props.newsletter.totalSubscribers}</p>
                </div>
                
            </div>
            <img src="/placeholder_newsletter.png" className="newsletter__img" alt="..." />
        </div>
    )
}


export default NewsletterBanner;