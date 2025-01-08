import { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Button,
    Textarea,
    Image,
} from "@nextui-org/react";
import PostControlApi from "../api-helpers/postapi";
import Cookies from "js-cookie";

export default function NewPostCard({afterPost}) {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const IMGBB_API_KEY = "cbc37b1145d67b711e5697a34fc7f76d"; // Replace with your ImgBB API Key
    const jwtToken = Cookies.get("socialpiloginjwt"); // Retrieve JWT token from cookie
    const userId = Cookies.get("socialpiloginid"); // Retrieve user ID from cookie

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
        }
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
            return result.data.url; // Live URL of the uploaded image
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    const handlePost = async () => {
        if (!file) {
            alert("Please upload an image before posting.");
            return;
        }

        setIsLoading(true);

        try {
            // Upload the image to ImgBB
            const imageUrl = await uploadImage(file);

            if (imageUrl) {
                setUploadedImageUrl(imageUrl);

                // Call the API to create a new post
                const response = await PostControlApi.createNewPost(jwtToken, userId, imageUrl, description);
                console.log("Post created successfully:", response);
                setFile(null)
                setDescription("")
                afterPost()
            } else {
                alert("Failed to upload the image. Please try again.");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            alert("An error occurred while creating the post. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-md">Create New Post</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-4">
                {/* Drop Box for Image Upload */}
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center relative">
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                    {file ? (
                        <Image
                            alt="Uploaded"
                            src={URL.createObjectURL(file)}
                            className="rounded-md"
                            width={200}
                            height={200}
                        />
                    ) : (
                        <p className="text-default-500">Drag and drop an image, or click to upload.</p>
                    )}
                </div>

                {/* Text Area for Post Description */}
                <Textarea
                    placeholder="Write a description for your post..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </CardBody>
            <Divider />
            <CardFooter>
                <Button onClick={handlePost} color="primary" className="w-full" isDisabled={isLoading}>
                    {isLoading ? "Posting..." : "Post"}
                </Button>
            </CardFooter>

            {/* Display uploaded image URL */}
            {/* {uploadedImageUrl && (
                <div className="text-small text-success mt-4 text-center">
                    Uploaded Image URL: <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">{uploadedImageUrl}</a>
                </div>
            )} */}
        </Card>
    );
}