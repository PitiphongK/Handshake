import CustomButton from '../CustomButtons/CustomButton';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Avatar,
  Form,
  Textarea,
  SharedSelection,
  addToast,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { UserData } from '../../interfaces/interfaces';
import apiClient from '../../services/apiClient'; // Axios client

import { useState, useEffect, useRef } from 'react';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // For redirection
import userImage from "../../assets/user.png"

import './Navbar.css';
import { useAppSelector } from '../../../redux/hooks';
import Searchbar from '../Searchbar/Searchbar';
import { AxiosError } from 'axios';
import { isLoggedIn } from '../../utils/ProtectedRoute';

const Navbar = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const imageUrl = useAppSelector((state) => state.user.imageUrl);
  const popupRef = useRef<HTMLDivElement | null>(null); // Ref for the popup element
  const navigate = useNavigate(); // Use React Router's navigate for redirection

  const togglePopup = (event: React.MouseEvent): void => {
    event.stopPropagation(); // Prevent the click event from propagating to the parent element
    setIsPopupVisible((prev) => !prev);
    console.log('Toggled popup visibility');
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement).classList.contains('profile-icon') // Prevent closing when clicking the profile pic
    ) {
      setIsPopupVisible(false);
    }
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 200);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isPopupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupVisible]);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/landing');
      return;
    }
    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get('/api/user-profiles/');
        setUsers(response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log('Error fetching profiles');
          addToast({
            title: "Error fetching profiles",
            description: err?.response?.data.detail,
            color: "danger",
            timeout: 3000,
            classNames: {
              base: "shadow-lg",
            },
          });
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      await apiClient.post('/api/doorway/logout/');

      // Clear the authentication token from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user_id');

      // Redirect to the login page
      console.log('Logout successful');
      navigate('/landing');
      addToast({
        title: "Logout Successfully",
        description: "We hope to see you soon!",
        color: "success",
        timeout: 3000,
        classNames: {
          base: "shadow-lg",
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Logout failed:', error);
        addToast({
          title: "Cannot logout",
          description: error?.response?.data.detail,
          color: "danger",
          timeout: 3000,
          classNames: {
            base: "shadow-lg",
          },
        });
      }
    }
  };

  const handleSelectionChange = (keys: SharedSelection) => {
    setSelectedMembers(new Set(keys as unknown as string[]));
  };

  const handleResetSelection = () => {
    setSelectedMembers(new Set());
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as { name: string; description: string };

    // Now combine the form data with the selected members
    const submissionData = {
      ...data,
      members: Array.from(selectedMembers).map(id => Number(id)) // Convert Set to Array
    };
    try {
      const response = await apiClient.post(`/api/create-project/`, {
        name: submissionData.name,
        description: submissionData.description,
        members: submissionData.members
      })
      if (response.status === 201) {
        console.log("created VIP successfully");
        addToast({
          title: "Success",
          description: "VIP is created successfully",
          color: "success",
          timeout: 3000,
          // shouldShowTimeoutProgess: true,
          // variant: "bordered",
          classNames: {
            base: "shadow-lg",
          },
        });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("error: cannot create VIP")
        addToast({
          title: "Error cannot create VIP",
          description: err?.response?.data.detail,
          color: "danger",
          timeout: 3000,
          classNames: {
            base: "shadow-lg",
          },
        });
      }
    }

    console.log(submissionData.name, submissionData.description, submissionData.members);

    onOpenChange();
  };

  return (
    <div className={`navbar ${scrolled ? "scrolled" : ""}`} onClick={() => setIsPopupVisible(false)}>
      <div className='nav-left'>
        <h1 onClick={() => navigate('/')} className='logo'>Handshake</h1>
        <Searchbar />
        <div className='text-base hover:cursor-pointer hover:border-b-1' onClick={() => navigate("/")}>Home</div>
        <div className='text-base hover:cursor-pointer hover:border-b-1' onClick={() => navigate("/vip")}>VIP</div>
      </div>
      <div className="profile-container gap-8">
        <Button radius="full" color="primary" variant='solid' onPress={onOpen} startContent={
          <Plus size={20} />}
        >Create VIP</Button>
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
              <>
                <Form
                  className="items-stretch gap-0"
                  onSubmit={onSubmit}
                >
                  <ModalHeader className="flex flex-col gap-1">Create a VIP</ModalHeader>
                  <ModalBody>
                    <Input
                      isRequired
                      name="name"
                      label="Project name"
                      variant="bordered"
                    />
                    <Textarea
                      isRequired
                      name="description"
                      label="Project description"
                      variant="bordered"
                    />
                    <div className='flex gap-4 justify-center items-center max-w-full'>
                      <Select
                        className="max-w-xs"
                        name="members"
                        items={users}
                        label="Add members"
                        placeholder="Select a user"
                        selectionMode='multiple'
                        variant="bordered"
                        selectedKeys={selectedMembers}
                        onSelectionChange={handleSelectionChange}
                      >
                        {(user) => (
                          <SelectItem key={user.id} textValue={`${user.first_name} ${user.last_name}`}>
                            <div className="flex gap-2 items-center">
                              <Avatar alt={`${user.first_name} ${user.last_name}`} className="flex-shrink-0" size="sm" src={user.picture} />
                              <div className="flex flex-col">
                                <span className="text-small">{`${user.first_name} ${user.last_name}`}</span>
                                <span className="text-tiny text-default-400">{user.email}</span>
                              </div>
                            </div>
                          </SelectItem>
                        )}
                      </Select>
                      <Button
                        variant="bordered"
                        color="warning"
                        onPress={handleResetSelection}
                      >
                        Reset
                      </Button>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" type="submit" className='w-full'>
                      Create
                    </Button>
                  </ModalFooter>
                </Form>
              </>
            )}
          </ModalContent>
        </Modal>
        <img
          className="profile-icon"
          src={imageUrl ? imageUrl : userImage}
          onClick={togglePopup} // Toggle popup visibility
        />
        <div className={`popup ${isPopupVisible ? "visible" : ""}`} ref={popupRef}>
          <CustomButton text="Account" icon={faUser} link="/account" />
          <CustomButton text="Logout" icon={faRightFromBracket} onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
