import { useNavigate } from "react-router-dom";
import { ProjectData } from "../../interfaces/interfaces";
import apiClient from "../../services/apiClient";
import { useEffect, useMemo, useState } from "react";
import userImage from "../../assets/user.png";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

const Project: React.FC<ProjectData> = ({ id, name, owner, members, posts, date_created }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string>();
  const [ownerName, setOwnerName] = useState("");
  const [date, setDate] = useState<string>();
  const dateOptions = useMemo(() => ({
    day: "numeric" as const,
    month: "short" as const,
    year: "numeric" as const
  }), []);

  useEffect(() => {
    console.log(owner)
    const fetchOwnerDetail = async () => {
      try {
        const response = await apiClient.get(`/api/user-profiles/${owner}`);
        const ownerData = response.data;
        setOwnerName(`${ownerData.first_name} ${ownerData.last_name}`);
        setImageUrl(ownerData.picture);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log('Error fetching projects');
          addToast({
            title: "Error fetching projects",
            description: err?.response?.data.detail,
            color: "danger",
            timeout: 3000,
            classNames: {
              base: "shadow-lg",
            },
          });
        }
      }
    }
    fetchOwnerDetail();
    const dateObject = new Date(date_created);
    setDate(dateObject.toLocaleString("default", dateOptions));
  }, [owner, date_created, dateOptions]);

  return (
    <div className="flex flex-col min-w-fit bg-white lg:mx-[calc((100vw-940px)/2)] mt-6 md:rounded-lg">
      <p onClick={() => navigate(`/vip/${id}`)} className="text-base font-bold text-default-900 p-4 hover:underline cursor-pointer">{name}</p>
      <hr className="border-t border-default-300" />
      <div className='flex flex-wrap gap-1 p-4'>
        <p className="text-sm text-default-900">{date}</p>
        <p className="text-sm text-default-900">·</p>
        <img src={imageUrl ? imageUrl : userImage} alt="owner" className="w-5 h-5 rounded-full" />
        <p className="text-sm text-default-900">{ownerName}</p>
        <p className="text-sm text-default-900">·</p>
        <p className="text-sm text-default-900">{posts.length} posts</p>
        <p className="text-sm text-default-900">·</p>
        <p className="text-sm text-default-900">{members.length} members</p>
      </div>
    </div>
  )
}

export default Project