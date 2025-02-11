import React from "react";
import { Form, Input, Checkbox, Button, Card } from "@nextui-org/react";
import authService from "../api-helpers/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function SignupPage() {
  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [profilePicture, setProfilePicture] = React.useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const IMGBB_API_KEY = "cbc37b1145d67b711e5697a34fc7f76d"; // Replace with your ImgBB API Key

  const getPasswordError = (value) => {
    if (value.length < 4) {
      return "Password must be 4 characters or more";
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      return "Password needs at least 1 uppercase letter";
    }
    if ((value.match(/[^a-z]/gi) || []).length < 1) {
      return "Password needs at least 1 symbol";
    }
    return null;
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    const usernameFromEmail = value.split("@")[0];
    setUsername(usernameFromEmail);
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.data.url);
      return result.data.url; // Live URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Validate inputs
    const newErrors = {};

    const passwordError = getPasswordError(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (fullName.toLowerCase() === "admin") {
      newErrors.fullName = "Nice try! Choose a different name.";
    }

    if (data.terms !== "true") {
      newErrors.terms = "Please accept the terms.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Upload image if selected
    let imageUrl = "";
    if (profilePicture) {
      imageUrl = await uploadImage(profilePicture);
      if (!imageUrl) {
        console.error("Failed to upload profile picture.");
        return;
      }
    }

    // Prepare form data
    const formData = {
      username,
      fullName,
      email,
      password,
      profilePicture: imageUrl,
    };

    // Submit form data to the backend
    try {
      const response = await authService.register(formData);
      setSubmitted(response);
      console.log("Registration successful:", response);
      setLoading(false);
      toast.success("Registration successful!");
      navigate('/login')
    } catch (error) {
      setLoading(false);
      toast.error("Registration failed. Please check your inputs.");
      console.error("Registration failed:", error);
    }
  };

  return (
    <Card className="flex flex-row w-full h-auto mx-auto" style={{width: 800, height: 630}}>
    {/* Left Side - Image */}
    <div className="flex  w-1/2 bg-cover bg-center" style={{height:"100vh"}} >
         <img src="https://i.ibb.co/WvbPnPM/Screenshot-from-2025-01-08-02-02-35-1.png"/>
      {/* Optionally add an overlay or text here */}
    </div>
  
    {/* Right Side - Form */}
    <div className="flex flex-col items-center justify-center w-1/2 p-8">
      <Form
        className="w-full justify-center items-center space-y-4"
        validationBehavior="native"
        validationErrors={errors}
        onReset={() => setSubmitted(null)}
        onSubmit={onSubmit}
        style={{ marginTop: 30 }}
      >
        <div className="flex flex-col gap-4 max-w-md">
          {/* Full Name Input */}
          <Input
            isRequired
            errorMessage={errors.fullName}
            label="Full Name"
            labelPlacement="outside"
            name="fullName"
            placeholder="Enter your full name"
            onValueChange={setFullName}
            value={fullName}
          />
  
          {/* Email Input */}
          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your email";
              }
              if (validationDetails.typeMismatch) {
                return "Please enter a valid email address";
              }
            }}
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onValueChange={handleEmailChange}
          />
  
          {/* Username Input */}
          <Input
            isReadOnly
            label="Username"
            labelPlacement="outside"
            name="username"
            value={username}
            placeholder="Auto-filled from email"
          />
  
          {/* Password Input */}
          <Input
            isRequired
            errorMessage={getPasswordError(password)}
            isInvalid={getPasswordError(password) !== null}
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onValueChange={setPassword}
          />
  
          {/* Profile Picture Upload */}
          <Input
            type="file"
            label="Profile Picture"
            labelPlacement="outside"
            name="profilePicture"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
  
          {/* Terms and Conditions */}
          <Checkbox
            isRequired
            isInvalid={!!errors.terms}
            name="terms"
            validationBehavior="aria"
            value="true"
            onValueChange={() => setErrors((prev) => ({ ...prev, terms: undefined }))}
          >
            I agree to the terms and conditions
          </Checkbox>
  
          {errors.terms && <span className="text-danger text-small">{errors.terms}</span>}
  
          {/* Buttons */}
          <div className="flex gap-4">
            <Button className="w-full" color="primary" type="submit">
              {loading ? "Registering..." : "Register"}
            </Button>
            <Button type="reset" variant="bordered">
              Reset
            </Button>
          </div>
        </div>
  
        <p style={{ cursor: "pointer", textAlign: "center" }} onClick={() => { navigate('/login') }}>login</p>
      </Form>
    </div>
  </Card>
  
  );
}