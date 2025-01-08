import { Listbox, ListboxItem, Avatar, Button, Input, Card } from "@nextui-org/react";
import PostControlApi from "../api-helpers/postapi";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ListboxWrapper = ({ children }) => (
  <div className="w-full max-w-[300px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export default function FriendsList() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getJWT = () => {
    return Cookies.get("socialpiloginjwt");
  };

  const getUserId = () => {
    return Cookies.get("socialpiloginid");
  };

  const fetchUsersViaSearch = async (token, searchterm) => {
    try {
      const response = await PostControlApi.searchUser(token, searchterm);
      console.log("Fetched users:", response);
      setUsers(response.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const followUser = async (usertofollow) => {
    const id = getUserId()
    const jwtToken = getJWT();
    try {
      const response = await PostControlApi.followUser(jwtToken, id, usertofollow)
      console.log("follow users response:", response);
      fetchUsersViaSearch(jwtToken, searchTerm);
    } catch (error) {
      console.log("Error following user users:", error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const jwtToken = getJWT();
      if (!jwtToken) {
        console.error("JWT token not found");
        return;
      }
      fetchUsersViaSearch(jwtToken, searchTerm);
    }
  };

  return (
    <Card className="py-4" style={{ marginBottom: 20,marginRighton: 20, marginLeft: 20, marginRight: 20 }}>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <ListboxWrapper>
          {/* Search Bar */}
          <div className="p-2">
            <Input
              placeholder="Search friends..."
              size="md"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* Friends List */}
          <Listbox
            isVirtualized
            className="max-w-xs"
            label="Friends List"
            placeholder="Select a user"
            virtualization={{
              maxListboxHeight: 400,
              itemHeight: 60, // Adjusted for avatar size
            }}
          >
            {users.map((user, index) => (
              <ListboxItem key={index} value={user.value} onClick={() => { navigate(`/profile/${user['_id']}`) }}>
                <div className="flex items-center justify-between w-full gap-4">
                  {/* Avatar */}
                  <Avatar src={user.profilePicture} alt={user.label} size="sm" />

                  {/* Name */}
                  <span className="text-md flex-grow">{user.fullName}</span>

                  {/* Follow Button */}
                  {!user.followers.includes(getUserId()) && <Button
                    size="sm"
                    variant="flat"
                    className="text-small"
                    onClick={() => followUser(user['_id'])}
                  >
                    Follow
                  </Button>}
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        </ListboxWrapper>
      </div>
    </Card>
  );
}