import React, { useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button } from "@nextui-org/react";
import PostCardComponent from "../components/postcard";
import { useParams } from "react-router-dom";
import PostControlApi from "../api-helpers/postapi";
import Cookies from 'js-cookie';

export default function UserProfile() {
    const [isFollowed, setIsFollowed] = React.useState(false);
    const { username } = useParams();
    const [userdata, Setuserdata] = React.useState(null)
    const [posts, setPosts] = React.useState([]);

    const getJWT = () => {
        return Cookies.get('socialpiloginjwt');
    };
    const getUserId = () => {
        return Cookies.get("socialpiloginid");
    };

    const followUser = async (usertofollow) => {
        const id = getUserId()
        const jwtToken = getJWT();
        try {
          const response = await PostControlApi.followUser(jwtToken,id,usertofollow)
          console.log("follow users response:", response);
          setIsFollowed(true)
        } catch (error) {
          console.log("Error following user users:", error);
        }
      };
    const fetchUser = async (token) => {
        try {
            const user = await PostControlApi.getUserById(token, username)
            console.log(user);
            Setuserdata(user);
            const userid = getUserId()
            if(user.followers.includes(userid)){
                console.log("following")
                setIsFollowed(true)
            }
            else if(user['_id']===userid){
                setIsFollowed(true)
            }else{
                setIsFollowed(false)
            }

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchAllPosts = async (token, userId) => {
        try {
            const response = await PostControlApi.getAllPostsByUser(token, userId);
            console.log("Fetched posts:", response);
            setPosts(response['posts']); // Optionally store posts in state for rendering
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchAfterLike = async()=>{
        const jwt = getJWT();
        fetchAllPosts(jwt,username)
    }

    useEffect(() => {
        const jwt = getJWT();
        if (jwt) {
            fetchUser(jwt);
            fetchAllPosts(jwt,username)
        } else {

        }
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <Card className="max-w-[400px]" >
                <CardHeader className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar
                            isBordered
                            radius="full"
                            size="lg"
                            src={userdata?.profilePicture}
                        />
                        <div className="flex flex-col items-center">
                            <h4 className="text-lg font-semibold text-default-600">{userdata?.fullName}</h4>
                            <h5 className="text-sm text-default-400">{userdata?.username}</h5>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="text-center text-small text-default-400 px-6 py-4">
                    <p>{userdata?.coverPicture}</p>

                </CardBody>
                <CardFooter className="flex flex-col items-center gap-3 px-6 py-4">
                    <div className="flex justify-center gap-6">
                        <div className="flex flex-col items-center">
                            <p className="font-semibold text-default-400 text-sm">{userdata?.following.length}</p>
                            <p className="text-default-400 text-sm">Following</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="font-semibold text-default-400 text-sm">{userdata?.followers.length}</p>
                            <p className="text-default-400 text-sm">Followers</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="font-semibold text-default-400 text-sm">{userdata?.posts.length}</p>
                            <p className="text-default-400 text-sm">Posts</p>
                        </div>
                    </div>
                    {!isFollowed&&<Button
                        className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                        color="primary"
                        radius="full"
                        size="sm"
                        variant={isFollowed ? "bordered" : "solid"}
                        onPress={() => followUser(username)}
                    >
                        {isFollowed ? "" : "Follow"}
                    </Button>}
                </CardFooter>
            </Card>

            <div style={{ height: 40 }}></div>
            <h4 className="text-lg font-semibold text-default-600">All Posts</h4>
            <div style={{ height: 10 }}></div>

            {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <PostCardComponent key={index} post={post} afterLike={fetchAfterLike} />
                    ))
                ) : (
                    <p>No posts available</p>
                )}
        </div>
    );
}
