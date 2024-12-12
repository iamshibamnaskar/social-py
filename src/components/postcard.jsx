import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faMessage, faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"; // Import the specific icon
import { Card, CardHeader, CardBody, Image, Avatar, CardFooter } from "@nextui-org/react";
import PostControlApi from "../api-helpers/postapi";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function PostCardComponent({ post,afterLike }) {
  const getJWT = () => {
    return Cookies.get("socialpiloginjwt");
  };
  const getUserId = () => {
    return Cookies.get("socialpiloginid");
};

  const LikePost = async (token, postId,userid) => {
    try {
      const response = await PostControlApi.likePost(token, userid,postId);
      console.log("Like post:", response);
      afterLike()
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLikeClick = async () =>{
    const jwt = getJWT();
    const userid = getUserId();
    console.log(userid)
    if (jwt) {
      LikePost(jwt,post['_id'],userid)
    } else {
    }
  }

  // useEffect(() => {
  //   const jwt = getJWT();
  //   const userid = getUserId();

  //   if (jwt) {
      
  //   } else {
  //   }
  // }, []);
  return (
    <Card className="py-4" style={{ marginBottom: 20 }}>
      <CardHeader className="flex items-start gap-5">
        {/* Left Section: Avatar and Vertical Line */}
        <div className="flex flex-col items-center">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={post?.user.profilePicture || "https://nextui.org/avatars/avatar-1.png"} // Default avatar if none provided
          />
          {/* Vertical Line */}
          <div className="border-l-2 border-gray-300 h-full mt-2"></div>
        </div>

        {/* Right Section: Text Content */}
        <div className="flex flex-col">
          <h4 className="text-small font-semibold leading-none text-default-600">
            {post?.user.fullName || "Unknown User"}
          </h4>
          <h5 className="text-small tracking-tight text-default-400">
            @{post?.user.username || "unknown"}
          </h5>
        </div>
      </CardHeader>

      <CardBody className="flex py-2 items-center gap-5">
        {/* Text Content */}
        <div className="flex-1" style={{marginRight:'auto',marginLeft:10}} >
          <p className="text-sm text-default-400">
            {post?.caption || "No caption provided."}
          </p>
        </div>
        {/* Image */}
        {post?.image && (
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={post.image}
            width="90%"
          />
        )}
      </CardBody>

      <CardFooter style={{ marginBottom: -10 }}>
        <div style={{ display: "flex", padding: 10 }}>
          {post?.likes.includes(getUserId())?(<FontAwesomeIcon size="lg" color="red" icon={farHeart} onClick={()=>{handleLikeClick()}} />):(<FontAwesomeIcon size="lg" icon={farHeart} onClick={()=>{handleLikeClick()}} />)}
          
          <h5
            className="text-small tracking-tight text-default-400"
            style={{ marginLeft: 10 }}
          >
            {post?.likes.length || 0} Likes
          </h5>
        </div>
        
      </CardFooter>
    </Card>
  );
}
