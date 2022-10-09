import axios from "axios";
import { useState } from "react";
import "./UploadImage.css";

function UploadImage(props) {
  const [image, changeImage] = useState("");
  const [rotatedImage, changeRotatedImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
            handleImageUpload(
              e,
              changeImage,
              setErrorMessage
            )
          }
          className={"upload-button"}
        />
      </div>

      {errorMessage != "" && <p>{errorMessage}</p>}
      <div className={"image-section"}>
        {/* {originalImage != "" && (
          <img
            src={originalImage}
            style={{ width: "50%", maxWidth: "500px", marginTop: "20px" }}
          />
        )} */}
        {image != "" && (
          <img
            src={image}
            style={{ maxWidth: "50%", marginTop: "20px" }}
          />
        )}
      </div>
    </div>
  );
}

function handleImageUpload(
  e,
  changeImage,
  setErrorMessage
) {
  let selectedImage = e.target.files[0];
  const selectedImageURL = URL.createObjectURL(selectedImage);
  if (selectedImage.size > 5000000) {
    setErrorMessage(
      "Image size is too big. Try again with an image size less than 5MB."
    );
  } else {
    changeImage(selectedImageURL);
    setErrorMessage("");
    saveImage(
      selectedImage,
      selectedImageURL,
      changeImage,
      setErrorMessage
    );
  }
}

async function saveImage(
  selectedImage,
  selectedImageURL,
  changeImage,
  setErrorMessage
) {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  let data = {
    imageFile: await toBase64(selectedImage),
  };

  //   await fetch("/api/endpoint", {
  //     method: "POST",
  //     headers: new Headers({
  //       "Content-Type": "application/json",
  //     }),
  //     body: JSON.stringify(data),
  //   })
  console.log(selectedImage);
  axios
    .post(`http://localhost:3001/uploadImage`, data)
    // axios({
    //     method: 'post',
    //     url: 'http://localhost:3001/uploadImage',
    //     headers: {'Content-Type' : 'application/json'},
    //     body: {"a": 1}
    // })
    .then(async (res) => {
      let resJSON = await res.data;
      console.log(res);
      console.log(resJSON);
      if (res.status === 200) {
        changeImage(resJSON.rotatedImage);
        setErrorMessage("Your image was successfully rotated!");
      } else {
        setErrorMessage("");
      }
    })
    .catch((error) => {
      console.log(error);
      console.log("upload failed.");
      setErrorMessage(error);
    });
}

export default UploadImage;
