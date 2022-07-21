import React, { useEffect, useState } from "react";
import './Create.css';


function Create(props) {

  const [newsletter, setNewsletter] = useState({ title: "", description: "" });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [])


  const handleInputChange = (key, e) => {

    const value = e.target.value;
    setNewsletter({
      ...newsletter,
      [key]: value
    })

  }

  const handleToggleModal = () => {
    props.onToggleModal(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    for (const key in newsletter) {
      if (newsletter[key] === "") {
        alert("All elements must be filled")
        return;
      }
    }

    postNewsletter();
  }

  const postNewsletter = () => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsletter)
    };
    fetch('/api/newsletters', requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          props.onToggleModal(false);
          props.onNewPublication(result.newsletter);

        },
        (error) => {
          console.log(error);
          props.onToggleModal(false);
        }
      )
  }

  return (
    <>
      <div className="darkBG" />
      <div className="centered">
        <div className="modal">

          <button onClick={handleToggleModal} className="closeIcon">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="black" />
            </svg>
          </button>

          <div className="modal__header">
            <p className="modal__title">Create your newsletter</p>
          </div>

          <div className="modal__content">
            <form className="form" id="newNewsletterForm" onSubmit={handleSubmit}>
              <div className="form__group">
                <label className="form__label" htmlFor="order">Newsletter name:</label>
                <div className="form__item">
                  <input onChange={(e) => handleInputChange("title", e)} value={newsletter.title} className="form__input" type="text" id="title" />
                </div>
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="order">What is it about?</label>
                <div className="form__item">
                  <input onChange={(e) => handleInputChange("description", e)} value={newsletter.description} className="form__input" type="text" id="description" />
                </div>
              </div>
            </form>
          </div>

          <div className="modal__actions">
            <button onClick={handleToggleModal} className="button button--empty">Cancel</button>
            <button type="submit" form="newNewsletterForm" value="Submit" className="button button--fill button--ml">Create</button>
          </div>
        </div>
      </div>
    </>
  );



}



export default Create;