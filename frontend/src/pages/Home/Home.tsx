import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import apiClient from '../../services/apiClient';
import { useEffect, useState } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { Option } from '../../interfaces/interfaces';
import Filter from '../../components/Filter/Filter';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spinner } from '@heroui/react';
import { Search } from 'lucide-react';
import userImage from "../../assets/user.png";
import { AxiosError } from 'axios';
import { isLoggedIn } from '../../utils/ProtectedRoute';
// import { Skeleton, Card } from '@heroui/react';


interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  institution: number;
  location: string;
  interest_fields: number[];
  interest_activities: number[];
  picture: string;
}

const Home = () => {
  const dispatch = useAppDispatch();
  const institutionOptions = useAppSelector((state) => state.form.institutionOptions) as Option[];
  const interestFieldOptions = useAppSelector((state) => state.form.interestFieldOptions) as Option[];
  const interestActivityOptions = useAppSelector((state) => state.form.interestActivityOptions) as Option[];
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<{
    location: string[];
    institution: string[];
    field: string[];
    activity: string[];
  }>({
    location: [''],
    institution: [''],
    field: [''],
    activity: [''],
  });

  const [filteredProfiles, setFilteredProfiles] = useState<UserData[]>([]);
  const [profiles, setProfiles] = useState<UserData[]>([]);

  const institutionNumberToName = (institutionNumber: number) => {
    return institutionOptions.find((option: Option) => option.value === institutionNumber)?.label;
  }

  const interestFieldNumberToName = (interestFieldNumberList: number[]) => {
    return interestFieldNumberList.map((interestFieldNumber: number) => {
      return interestFieldOptions.find((option: Option) => option.value === interestFieldNumber)?.label;
    });
  }

  const interestActivityNumberToName = (interestActivityNumberList: number[]) => {
    return interestActivityNumberList.map((interestActivityNumber: number) => {
      return interestActivityOptions.find((option: Option) => option.value === interestActivityNumber)?.label;
    });
  }

  useEffect(() => {
  if (!isLoggedIn()) {
    navigate('/landing');
    return;
  }
    const getSearchedProfiles = async () => {
      try {
        const response = await apiClient.get(`/api/search-profile/?q=${searchParams.get('q') || ''}`);
        setProfiles([])
        for (const user_id of response.data) {
          getProfile(Number(user_id));
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log('Error fetching profiles');
        }
      }
    };
    const getProfiles = async () => {
      try {
        const response = await apiClient.get('/api/user-profiles/');
        setProfiles(response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log('Error fetching profiles');
        }
      }
    };
    const getProfile = async (user_id: number) => {
      try {
        const response = await apiClient.get(`/api/user-profiles/${user_id}`);
        setProfiles((prev) => [...prev, response.data]);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log('Error fetching profiles');
        }
      }
    };
    if (!searchParams.get('q')) {
      getProfiles();
      return;
    }
    getSearchedProfiles();
  }, [dispatch, searchParams]);

  useEffect(() => {
    const location = searchParams.get('location') || '';
    const institution = searchParams.get('institution') || '';
    const field = searchParams.get('field') || '';
    const activity = searchParams.get('activity') || '';

    setFilters({
      location: location.split(','),
      institution: institution.split(','),
      field: field.split(','),
      activity: activity.split(','),
    });
  }, [searchParams]);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const filtered = profiles.filter((profile) => {
      const { location, institution, field, activity } = filters;
      const commonFields = profile.interest_fields ? profile.interest_fields.filter((item: number) => {
        return field.includes(typeof item === 'string' ? item : item.toString())
      }) : [];
      const commonActivities = profile.interest_activities ? profile.interest_activities.filter((item: number) => {
        return activity.includes(typeof item === 'string' ? item : item.toString())
      }) : [];

      return (
        (location[0] === '' || location.includes(profile.location)) &&
        (institution[0] === '' || institution.includes(profile.institution.toString())) &&
        (field[0] === '' || commonFields.length > 0) &&
        (activity[0] === '' || commonActivities.length > 0) &&
        (userId !== profile.id.toString())
      );
    });
    setFilteredProfiles(filtered);
    setIsLoading(false);
  }, [filters, profiles]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Home | Handshake</title>
        </Helmet>
      </HelmetProvider>
      <Navbar />
      <Filter />
      <div className="card-container">
        {/* <Card className="w-[500px] p-4 gap-4 flex flex-row" radius="lg">
          <div className="space-y-3 flex-grow">
            <Skeleton className="h-5 w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
            <Skeleton className="w-1/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </div>
          <Skeleton className="h-20 rounded-full flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-default-300" />
          </Skeleton>
        </Card> */}
        {
          isLoading ? (
            <div className='flex w-screen h-60 flex-col justify-center items-center'>
              <div className='flex gap-2'><Spinner size="lg" /></div>
            </div>
          ) :
            filteredProfiles.length === 0 ? (
              <div className='flex w-screen h-60 flex-col justify-center items-center gap-5'>
                <div className='flex gap-2'><Search size={30} /><p className='font-semibol'>No results found</p></div>
              </div>
            ) : (
              filteredProfiles.map((profile, index) => (
                <ProfileCard
                  key={index}
                  name={`${profile.first_name} ${profile.last_name}`}
                  description={profile.bio}
                  location={profile.location}
                  institution={institutionNumberToName(profile.institution) || 'Unknown Institution'}
                  activity={interestActivityNumberToName(profile.interest_activities)[0] || 'Unknown Activity'}
                  imageUrl={profile.picture ? profile.picture : userImage}
                  fields={interestFieldNumberToName(profile.interest_fields)}
                  onClick={() => navigate(`/user/${profile.id}`)}
                />
              )))
        }
      </div>
    </>
  );
};

export default Home;