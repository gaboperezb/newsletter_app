import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import NewsletterBanner from "./Newsletter";
import './Publish.css';
import PublishForm from "./PublishForm";
import SubscribeForm from "./SubscribeForm";
import { useNavigate } from "react-router-dom";


function Publish(props) {

    const [newsletter, setNewsletter] = useState(null);
    const [successAlert, setSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const { newsletterId } = useParams();
    const navigate = useNavigate();
    


    useEffect(() => {
        getNewsletter();
    }, [])

    const showAlert = (form, message) => {

        
        setSuccessAlert(true);
        setSuccessMessage(message)
        setTimeout(() => {
            setSuccessAlert(false);
            if(form === "newsletter") {
                navigate("/");
            } else {
                let totalSubscribers = newsletter.totalSubscribers + 1;

                setNewsletter({
                    ...newsletter,
                    totalSubscribers
                  })

            }
        }, 2500);
    }

    const getNewsletter = () => {
        setNewsletter(props.getNewsletter(newsletterId))
    }

    return (
        <div className="container">
            {successAlert && <div className="alert">{successMessage}</div>}
            <div className="top-container">
                <section>
                    {newsletter && <NewsletterBanner newsletter={newsletter} />}
                </section>
            </div>

            <div className="bottom-container">
               <PublishForm newsletter={newsletter} onAlert={showAlert}/>
               <SubscribeForm newsletter={newsletter} onAlert={showAlert}/>
            </div>


        </div>
    )

}



export default Publish;