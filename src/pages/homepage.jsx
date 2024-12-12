import React, { useEffect, useState } from "react";
import PostCardComponent from "../components/postcard";
import NewPostCard from "../components/newpost";
import MakerCard from "../components/webmaster";
import FriendsList from "../components/friends";
import { useNavigate } from "react-router-dom";
import authService from "../api-helpers/api";
import Cookies from "js-cookie";
import PostControlApi from "../api-helpers/postapi";

export default function HomePageComponent() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    const getJWT = () => {
        return Cookies.get("socialpiloginjwt");
    };

    const getUserId = () => {
        return Cookies.get("socialpiloginid");
    };

    const fetchPostAfterLike = async() =>{
        
        const jwt = getJWT();
        const userId = getUserId();
        fetchAllPosts(jwt, userId);
    }

    const fetchUser = async (token) => {
        try {
            const user = await authService.refetch({ token });
            console.log(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            // Navigate to login if there is an error
            navigate("/login");
        }
    };

    const fetchAllPosts = async (token, userId) => {
        try {
            const response = await PostControlApi.getAllPosts(token, userId);
            console.log("Fetched posts:", response);
            setPosts(response['posts'].reverse()); // Optionally store posts in state for rendering
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        const jwt = getJWT();
        const userId = getUserId();

        if (jwt) {
            fetchUser(jwt);
            if (userId) {
                fetchAllPosts(jwt, userId);
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div style={{ display: "flex", gap: "20px", marginLeft: "10px" }}>
            <div style={{ flex: 1 }}>
                <NewPostCard afterPost={fetchPostAfterLike}/>
                <div style={{ height: 10 }}></div>
                <MakerCard />
            </div>
            <div style={{ flex: 2 }}>
                {/* Map over posts and render a PostCardComponent for each */}
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <PostCardComponent key={index} post={post} afterLike={fetchPostAfterLike} />
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>
            <div style={{ flex: 1 }}>
                <FriendsList />
            </div>
        </div>
    );
}
