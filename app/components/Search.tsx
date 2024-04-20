"use client";

import { useState } from "react";
import { GroupBase, SingleValue } from "react-select";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import {
  FetchResponseData,
  LoadOptionsResponse,
  SearchData
} from "../models/apiTypes";
import { SearchProps } from "../models/componentProps";

/**
 * Search component for searching cities.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onSearchChange - The function to be called when the search value changes.
 * @returns {JSX.Element} The Search component.
 */
const Search = ({ onSearchChange }: SearchProps): JSX.Element => {
  const [search, setSearch] = useState<SearchData | null>(null);

  const loadOptions = async (
    inputValue: string
  ): Promise<LoadOptionsResponse> => {
    try {
      const response = await fetch(`/api/searchCities?query=${inputValue}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      return {
        options: responseData.data.map((city: { latitude: any; longitude: any; name: any; country: any; }) => ({
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.country}`
        }))
      };
    } catch (error) {
      console.error("Failed to load options:", error);
      return { options: [] };
    }
  };

  const handleOnChange = (newValue: SingleValue<SearchData>) => {
    setSearch(newValue);
    if (newValue) {
      onSearchChange(newValue);
    }
  };

  return (
    <label>
      <AsyncPaginate
        /* fix for Warning: Prop `id` did not match. Server: "react-select-6-live-region" Client: "react-select-2-live-region"
      https://github.com/JedWatson/react-select/issues/5459#issuecomment-1312245530
      */
        debounceTimeout={300}
        id="searchbar"
        instanceId={"searchbar"}
        loadOptions={loadOptions}
        onChange={handleOnChange}
        placeholder="Click here and type city name."
        value={search}
      />
    </label>
  );
};

export default Search;
