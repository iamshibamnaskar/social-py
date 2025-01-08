import React from "react";
import { Form, Input, Button, Card } from "@nextui-org/react";
import authService from "../api-helpers/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function LoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();



  const getPasswordError = (value) => {
    if (value.length < 4 && value.length > 0) {
      return "Password must be 4 characters or more";
    }
    return null;
  };

  const onSubmit = async (e) => {
    console.log("Submitting form...");
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    // Custom validation
    const newErrors = {};

    if (!data.username) {
      newErrors.username = "Username is required";
    }
    const passwordError = getPasswordError(data.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call login API
    console.log("API Calling")
    try {
      const response = await authService.login(data);
      setSubmitted(response);
      console.log(response);
      console.log("Login success")
      setLoading(false);
      toast.success("Login successful!");
      Cookies.set("socialpiloginjwt", response.jwt, { expires: 1, path: "" });
      Cookies.set("socialpiloginid", response['user']['_id'], { expires: 1, path: "" });
      navigate('/')
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      toast.error("Login failed. Please check your credentials.");
    }



    // Clear errors after submission
    setErrors({});
  };

  return (
    <Card className="flex flex-col items-center justify-center" style={{width: 350, height: 400 ,margin:"auto", marginTop: "3%"}}>
      <Form
        className="w-full justify-center items-center space-y-4"
        validationBehavior="native"
        validationErrors={errors}
        onSubmit={onSubmit}
        style={{ marginTop: 50 }}
      >
        <div className="flex flex-col gap-4 max-w-md">
          {/* Username Input */}

          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your username";
              }
              return errors.username;
            }}
            label="Username"
            labelPlacement="outside"
            name="username"
            placeholder="Enter your username"
            value={username}
            onValueChange={setUsername}
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

          {/* Submit Button */}
          <Button className="w-full" color="primary" type="submit">
            {loading ? "Loging in..." : "Login"}
          </Button>
        </div>

        <p style={{ marginLeft: 150,cursor:"pointer" }} onClick={() => { navigate('/signup') }}>signup</p>

        {/* Submitted Data Display */}
        {submitted && (
          <div className="text-small text-default-500 mt-4">
            Login response: <pre>{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        )}
      </Form>
    </Card>
      );
}
