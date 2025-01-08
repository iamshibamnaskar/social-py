import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import Cookies from 'js-cookie';
import authService from "../api-helpers/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavbarComponent() {
  const navigate = useNavigate()
  const [userdata, Setuserdata] = useState(null)
  const getJWT = () => {
    return Cookies.get('socialpiloginjwt');
  };
  const fetchUser = async (token) => {
    try {
      const user = await authService.refetch({ token });
      console.log(user);
      Setuserdata(user)
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const jwt = getJWT();
    if (jwt) {
      fetchUser(jwt);
    } else {

    }
  }, []);

  const logout = () => {
    Cookies.remove('socialpiloginjwt');
    Cookies.remove('socialpiloginid');
    window.location.reload()
  }
  return (
    <Navbar>
      <NavbarBrand onClick={()=>{navigate('/')}}>
        <img src="https://i.ibb.co/fGPsqpP/removal-ai-30429249-7b84-4b0e-a266-5f9cdefeb8d0-screenshot-2-E9-K1-VD.png" className="w-10 h-10" style={{marginRight:"20px"}} />
        <p className="font-bold text-inherit">Social-py</p>
      </NavbarBrand>



      {userdata !== null && <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src={userdata['profilePicture']}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{userdata['email']}</p>
            </DropdownItem>
            <DropdownItem key="settings" onClick={()=>{navigate(`/profile/${userdata['_id']}`)}} >My Prifile</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={logout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>}
    </Navbar>
  );
}
