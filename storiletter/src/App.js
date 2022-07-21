import React, { useEffect, useState } from "react";
import Create from "./Create/Create";
import Home from "./Home/Home";
import Publish from "./Publish/Publish";
import Navbar from "./Navbar";
import './Navbar.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";



function App(props) {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newsletters, setNewsletters] = useState([]);

  useEffect(() => {
   
    fetch("/api/newsletters",)
      .then(res => res.json())
      .then(
        (result) => {

          setTimeout(() => {

            setIsLoaded(true);
            setNewsletters(result.newsletters);

          }, 300)

        },
        (error) => {

          setIsLoaded(true);
          setError(error);

        }
      )
  }, [])



 

  const handleToggleModal = (open) => {
    setModalIsOpen(open);
  }

  const handleNewPublication = (publication) => {
    let newslettersCopy = newsletters.slice();
    newslettersCopy.unshift(publication);
    setNewsletters(newslettersCopy);
  }


  const getNewsletter = (id) => {
    const newsletter = newsletters.find(newsletter => newsletter._id === id);
    return newsletter;
  }


  return (

   

    <BrowserRouter>
    
      {modalIsOpen && <Create onToggleModal={handleToggleModal} onNewPublication={handleNewPublication} />}
      <Navbar onToggleModal={handleToggleModal} />
      <Routes>
        <Route path="/newsletter/:newsletterId" element={<Publish getNewsletter={getNewsletter}/>} />
        <Route path="/" element={!isLoaded ? <div className="spinner"></div> : <Home onToggleModal={handleToggleModal} error={error} newsletters={newsletters} />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App;