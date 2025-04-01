import { Accordion, AccordionItem, Select, SelectItem, Selection, Button } from "@heroui/react";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { scottish_cities } from "../../utils/Scottish_Cities";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { Option } from "../../interfaces/interfaces";

const Filter = () => {
  const institutionOptions = useAppSelector((state) => state.form.institutionOptions);
  const interestFieldOptions = useAppSelector((state) => state.form.interestFieldOptions);
  const interestActivityOptions = useAppSelector((state) => state.form.interestActivityOptions);

  const [searchParams, setSearchParams] = useSearchParams();
  const location = searchParams.get("location") || "";
  const institution = searchParams.get("institution") || "";
  const field = searchParams.get("field") || "";
  const activity = searchParams.get("activity") || "";

  const [selectedLocation, setSelectedLocation] = useState<Selection>(location ? new Set(location.split(",")) : new Set());
  const [selectedInstitution, setSelectedInstitution] = useState<Selection>(institution ? new Set(institution.split(",")) : new Set());
  const [selectedField, setSelectedField] = useState<Selection>(field ? new Set(field.split(",")) : new Set());
  const [selectedActivity, setSelectedActivity] = useState<Selection>(activity ? new Set(activity.split(",")) : new Set());

  const handleLocationChange = (selected: Selection) => {
    setSelectedLocation(selected);
    const params = new URLSearchParams(searchParams);
    if (Array.from(selected).length === 0) {
      params.delete("location");
    } else {
      params.set("location", Array.from(selected).join(","));
    }
    setSearchParams(params);
  };

  const handleInstitutionChange = (selected: Selection) => {
    setSelectedInstitution(selected);
    const params = new URLSearchParams(searchParams);
    if (Array.from(selected).length === 0) {
      params.delete("institution");
    } else {
      params.set("institution", Array.from(selected).join(","));
    }
    setSearchParams(params);
  };

  const handleFieldChange = (selected: Selection) => {
    setSelectedField(selected);
    const params = new URLSearchParams(searchParams);
    if (Array.from(selected).length === 0) {
      params.delete("field");
    } else {
      params.set("field", Array.from(selected).join(","));
    }
    setSearchParams(params);
  };

  const handleActivityChange = (selected: Selection) => {
    setSelectedActivity(selected);
    const params = new URLSearchParams(searchParams);
    if (Array.from(selected).length === 0) {
      params.delete("activity");
    } else {
      params.set("activity", Array.from(selected).join(","));
    }
    setSearchParams(params);
  };
  
  const handleResetFilters = () => {
    setSelectedLocation(new Set());
    setSelectedInstitution(new Set());
    setSelectedField(new Set());
    setSelectedActivity(new Set());
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="flex justify-center py-4">
      <Accordion className="w-full max-w-[1024px] px-3 bg-white rounded-xl">
        <AccordionItem
          key="1"
          aria-label="Filter Options"
          title="Filter Options"
          startContent={<FilterIcon size={20} />}
          classNames={{ title: "text-sm text-default-700" }}
        >
          <div className="filters-container">
            <Select
              items={scottish_cities}
              selectedKeys={selectedLocation}
              onSelectionChange={handleLocationChange}
              placeholder="Location"
              aria-label="Location"
              size="sm"
              selectionMode="multiple"
              classNames={{
                base: 'w-fit',
                mainWrapper: 'w-52',
                listboxWrapper: 'w-52',
                value: 'text-default-800',
                trigger: "bg-white border border-default-300 data-[hover=true]:bg-default-300",
              }}
            >
              {(item: Option) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            <Select
              items={institutionOptions}
              selectedKeys={selectedInstitution}
              onSelectionChange={handleInstitutionChange}
              placeholder="Instituion"
              aria-label="Instituion"
              size="sm"
              selectionMode="multiple"
              classNames={{
                base: 'w-fit',
                mainWrapper: 'w-52',
                listboxWrapper: 'w-52',
                value: 'text-default-800',
                trigger: "bg-white border border-default-300 data-[hover=true]:bg-default-300",
              }}
            >
              {(item: Option) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            <Select
              items={interestFieldOptions}
              selectedKeys={selectedField}
              onSelectionChange={handleFieldChange}
              placeholder="Field"
              aria-label="Field"
              size="sm"
              selectionMode="multiple"
              classNames={{
                base: 'w-fit',
                mainWrapper: 'w-52',
                listboxWrapper: 'w-52',
                value: 'text-default-800',
                trigger: "bg-white border border-default-300 data-[hover=true]:bg-default-300",
              }}
            >
              {(item: Option) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            <Select
              items={interestActivityOptions}
              selectedKeys={selectedActivity}
              onSelectionChange={handleActivityChange}
              placeholder="Activity"
              aria-label="Activity"
              size="sm"
              selectionMode="multiple"
              classNames={{
                base: 'w-fit',
                mainWrapper: 'w-52',
                listboxWrapper: 'w-52',
                value: 'text-default-800',
                trigger: "bg-white border border-default-300 data-[hover=true]:bg-default-300",
              }}
            >
              {(item: Option) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            <Button
              variant="bordered"
              color="warning"
              onPress={handleResetFilters}
              className="h-8"
            >
              Reset
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;