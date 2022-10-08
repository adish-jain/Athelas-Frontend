import axios from "axios";
import { useState } from "react";

function UploadImage(props) {
  const [image, changeImage] = useState("");
  return (
    <div>
      <input
        type="file"
        id="myFile"
        name="filename"
        accept="image/*"
        onChange={(e) => handleProfileImageUpload(e, changeImage)}
      />
      {image != "" && <img src={image} />}
    </div>
  );
}

function handleProfileImageUpload(e, changeImage) {
  let selectedImage = e.target.files[0];
  const selectedImageURL = URL.createObjectURL(selectedImage);
  changeImage(selectedImageURL);
  saveProfileImage(selectedImage, selectedImageURL, changeImage);
  //   if (selectedImage.size > 5000000) {
  //     console.log("image too big");
  //   } else {
  //     saveProfileImage(selectedImage);
  //   }
}

async function saveProfileImage(selectedImage, selectedImageURL, changeImage) {
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
      console.log(resJSON);
      changeImage(resJSON.rotatedImage);
      //   let url = resJSON.url;
      console.log("success");
    })
    .catch((error) => {
      console.log(error);
      console.log("upload failed.");
    });
}

export default UploadImage;
