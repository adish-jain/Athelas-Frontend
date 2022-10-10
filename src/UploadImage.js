import axios from "axios";
import { useState } from "react";
import "./UploadImage.css";

function UploadImage() {
  const [image, changeImage] = useState("");
  const [selectedImage, setSelectedImage] = useState({});
  const [message, setMessage] = useState("");
  const [numDegrees, setNumDegrees] = useState(90);
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div className={"container"}>
      <div className={"input-container"}>
        Choose an Image
        <input
          type="file"
          id="myFile"
          name="filename"
          accept="image/*"
          onChange={(e) =>
            handleImageUpload(e, changeImage, setMessage, setSelectedImage)
          }
          className={"upload-button"}
        />
      </div>

      {!loading && message != "" && <p>{message}</p>}
      {loading && <p>{"Loading..."}</p>}
      <div className={"image-section"}>
        {image != "" && (
          <img
            src={image}
            style={{ width: "50vw", maxWidth: "50%", marginTop: "20px" }}
          />
        )}
      </div>
      {!showInput && (
        <div className={"button-section"}>
          {image != "" && (
            <div
              className={"input-container"}
              onClick={() => setShowInput(!showInput)}
            >
              Rotate
            </div>
          )}
          {image != "" && (
            <div
              className={"input-container"}
              onClick={() =>
                handleAction(
                  "invert",
                  numDegrees,
                  setShowInput,
                  selectedImage,
                  changeImage,
                  setMessage,
                  setSelectedImage,
                  setLoading
                )
              }
            >
              Invert
            </div>
          )}
          {image != "" && (
            <div
              className={"input-container"}
              onClick={() =>
                handleAction(
                  "greyscale",
                  numDegrees,
                  setShowInput,
                  selectedImage,
                  changeImage,
                  setMessage,
                  setSelectedImage,
                  setLoading
                )
              }
            >
              Greyscale
            </div>
          )}
        </div>
      )}
      {showInput && (
        <div className={"rotate-degrees"}>
          <div>How much do you want to rotate the image by?</div>
          <input
            type="text"
            pattern="[0-9]*"
            onChange={(e) => setNumDegrees(e.target.value.replace(/\D/, ""))}
            value={numDegrees}
            style={{ marginTop: "20px" }}
            className={"input-degrees"}
          />
          <div
            className={"input-container"}
            onClick={() => {
              handleAction(
                "rotate",
                numDegrees,
                setShowInput,
                selectedImage,
                changeImage,
                setMessage,
                setSelectedImage,
                setLoading
              );
            }}
          >
            Rotate
          </div>
        </div>
      )}
    </div>
  );
}

function handleAction(
  action,
  numDegrees,
  setShowInput,
  selectedImage,
  changeImage,
  setMessage,
  setSelectedImage,
  setLoading
) {
  if (action === "rotate") {
    setShowInput(false);
    let data = {
      imageFile: selectedImage,
      numDegrees: numDegrees,
    };
    saveImage(
      data,
      action,
      changeImage,
      setMessage,
      setSelectedImage,
      setLoading
    );
  } else {
    let data = {
      imageFile: selectedImage,
    };
    saveImage(
      data,
      action,
      changeImage,
      setMessage,
      setSelectedImage,
      setLoading
    );
  }
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

async function handleImageUpload(
  e,
  changeImage,
  setMessage,
  setSelectedImage
) {
  let selectedImage = e.target.files[0];
  const selectedImageURL = URL.createObjectURL(selectedImage);
  if (selectedImage.size > 5000000) {
    setMessage(
      "Image size is too big. Try again with an image size less than 5MB."
    );
  } else {
    selectedImage = await toBase64(selectedImage);
    changeImage(selectedImageURL);
    setSelectedImage(selectedImage);
    setMessage("");
  }
}

async function saveImage(
  data,
  endpoint,
  changeImage,
  setMessage,
  setSelectedImage,
  setLoading
) {
  setLoading(true);
  const endpointToMessage = {
    rotate: "rotated",
    invert: "inverted",
    greyscale: "greyscaled",
  };
  axios
    .post(`http://localhost:3001/${endpoint}`, data)
    .then(async (res) => {
      let resJSON = await res.data;
      if (res.status === 200) {
        changeImage(resJSON.returnedImage);
        setSelectedImage(resJSON.returnedImage);
        setLoading(false);
        setMessage(
          `Your image was successfully ${endpointToMessage[endpoint]}!`
        );
      } else {
        setMessage("");
      }
    })
    .catch((error) => {
      console.log(error);
      setMessage("There was an error, please try again.");
    });
}

export default UploadImage;
