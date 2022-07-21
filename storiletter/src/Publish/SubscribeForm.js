import { useState } from "react";

import "./SubscribeForm.css"

function SubscribeForm(props) {

    const [email, setEmail] = useState("");


    const handleInputChange = (key, e) => {
        const value = e.target.value;
        setEmail(value)

    }


    const subscribeEmail = () => {

        const data = {
            email,
            newsletterId: props.newsletter._id,
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch('/api/subscribe', requestOptions)
            .then(res => res.json())
            .then(
                (result) => {


                    if (result.code === "1") {
                        props.onAlert("email", "Email added to newsletter!");
                    } else {
                        alert(result.message)
                    }
                   
                    setEmail("")
                },
                (error) => {

                    console.log(error);

                }
            )
    }

    const handleSubscribeSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            alert("Email is mandatory");
            return;
        } else if (!validateEmail(email)) {
            console.log("Please add a valid email");
        }
        subscribeEmail();
    }


    const validateEmail = function (email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    return (
        <aside>
            <p className="publish__title">Add email to recipient list</p>
            <form onSubmit={(e) => handleSubscribeSubmit(e)}>
                <div className="form__group">
                    <label className="form__label" htmlFor="email">Email</label>
                    <div className="form__item">
                        <input onChange={(e) => handleInputChange("email", e)} value={email} className="form__input" type="email" id="email" />
                    </div>
                </div>
                <button type="submit" value="Submit" className="button button--fill">Add</button>
            </form>
        </aside>
    )

}

export default SubscribeForm;