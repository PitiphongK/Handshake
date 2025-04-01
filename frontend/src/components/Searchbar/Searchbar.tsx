import { Input, Spinner } from '@heroui/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

const Searchbar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false)
  
  const handleSearchChange = (value: string) => {
    setSearch(value);
    debounceSearch(value);
  }
  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('q')
    setSearchParams(params);
  }

  const debounceSearch = useDebouncedCallback((value: string) => {
    setIsSearchLoading(true);
    const params = new URLSearchParams(searchParams);
  
    if (value.length === 0) {
      params.delete('q');
      setIsSearchLoading(false);
    } else {
      params.set('q', value);
    }
  
    setSearchParams(params);
  }, 300);

  function handleOnsubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('Searching...');
    navigate(`/?q=${search}`);
  }

  const startContent = () => {
    return isSearchLoading ? (
      <Spinner size='sm' />
    ) : (
      <Search size={20} />
    )
  }

  useEffect(() => {
    setIsSearchLoading(false);
  }, [searchParams]);

  return (
    <form onSubmit={handleOnsubmit}>
      <Input
        type='text'
        placeholder='Search people'
        size="md"
        radius='sm'
        color='primary'
        isClearable
        onClear={handleClear}
        startContent={startContent()}
        value={search}
        onValueChange={handleSearchChange}
      >
      </Input>
    </form>
  )
}

export default Searchbar