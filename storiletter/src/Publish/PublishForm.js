import { useState } from "react";
import "./PublishForm.css"

function PublishForm(props) {

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [scheduleOption, setScheduledOption] = useState("now");
    
    const [publishing, setPublishing] = useState(false);
   

    const handlePublishSubmit = (e) => {
        e.preventDefault();

        if (!file || !title) {
            alert("All fields are mandatory");
            return;
        }

        if (file.type === "application/pdf" || file.type === "image/png") {
            setPublishing(true);
            getSignedRequest();
        } else {
            alert("We only accept .pd or .png files");
        }

    }


    const randomString = (length) => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }


    const handleInputChange = (key, e) => {
        const value = key === 'file' ? e.target.files[0] : e.target.value;

        switch (key) {
            case "file":
                setFile(value);
                break;
            case "title":
                setTitle(value);
                break;
            case "scheduleOption":
                setScheduledOption(value)
                if (value === "now") {
                    setDate("");
                    setTime("");
                }
                break;
            case "date":
                setDate(value)
                break;
            case "time":
                setTime(value)
                break;

            default:
                break;
        }

    }

    const getSignedRequest = () => {

        const fileType = file.type;
        const fileName = randomString(7) + "." + fileType.split('/')[1];

        fetch(`/api/s3/sign-s3?file-name=${fileName}&file-type=${fileType}`)
            .then(res => res.json())
            .then(
                (result) => {
                    let signedRequest = result.signedRequest;
                    const urlAWS = result.url;
                    const url = urlAWS.replace(/\s+/g, '+');
                    uploadFileS3(signedRequest, url);
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    const uploadFileS3 = (signedRequest, fileURL) => {

        const myHeaders = new Headers({ 'Content-Type': file.type });
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: file
        };

        fetch(signedRequest, requestOptions)
            .then((res) => sendMail(fileURL))
            .catch((error) => {
                console.log(error);
            })
    }

    const sendMail = (fileURL) => {

        const data = {
            title,
            fileURL,
            newsletterId: props.newsletter._id,
            date,
            time
        }

        Object.keys(data).forEach(key => {
            if (data[key] === '') {
                delete data[key];
            }
        });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch('/api/send', requestOptions);
        setPublishing(false);
        props.onAlert("newsletter", "Newsletter published!");

    }


    return (
        <section className="publish">
            
            <h2 className="publish__title">Publish</h2>
            <form onSubmit={(e) => handlePublishSubmit(e)}>
                <div className="form__group">
                    <label className="form__label" htmlFor="order">Title</label>
                    <div className="form__item">
                        <input onChange={(e) => handleInputChange("title", e)} value={title} className="form__input" type="text" id="title" />
                    </div>
                </div>

                <div className="form__group form__group--file">
                    <label className="form__label" htmlFor="order">Graphic (.pdf or .png)</label>
                    <div className="form__item form__item--file">
                        <input onChange={(e) => handleInputChange("file", e)} className="form__input custom-file-input" type="file" id="order" />
                    </div>
                </div>

                <div className="form__group form__group--file">
                    <div className="form__item form__item--radio">
                        <label className="radio">
                            <input value="now" checked={scheduleOption === "now"} onChange={(e) => handleInputChange("scheduleOption", e)} className="radio" type="radio" name="answer" />
                            Deliver now
                        </label>
                        <label className="radio">
                            <input value="schedule" checked={scheduleOption === "schedule"} onChange={(e) => handleInputChange("scheduleOption", e)} className="radio" type="radio" name="answer" />
                            Schedule
                        </label>

                        {scheduleOption === "schedule" && <div className="schedule">
                            <label htmlFor="date">Date</label>
                            <div className="form__item form__item--schedule">
                                <input onChange={(e) => handleInputChange("date", e)} value={date} className="formInput" id="date" type="date" />
                            </div>
                            <label htmlFor="time">Time</label>
                            <div className="form__item">
                                <input onChange={(e) => handleInputChange("time", e)} value={time} className="formInput form__item--schedule" id="time" type="time" />
                            </div>
                        </div>}

                    </div>
                </div>
                {!publishing ? <button type="submit" value="Submit" className="button button--fill">Publish</button> :
                    <button type="submit" value="Submit" className="button"><div className="spinner"></div></button>}
            </form>
        </section>

    )

}


export default PublishForm;