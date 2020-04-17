import React, { createContext, useContext } from "react";
import { QueryResult, useQuery } from "react-query";

const CovidDataContext = createContext<QueryResult<any>>({
  data: undefined,
  error: undefined,
  failureCount: 0,
  isFetching: true,
  refetch: () => new Promise((r) => r),
  status: "loading",
});

CovidDataContext.displayName = "CovidDataContext";

export const useCovidData = () => useContext(CovidDataContext);

export const CovidDataProvider: React.FC = ({ children }) => {
  const covidQueryResult = useQuery("summary", async (path) => {
    const res = await fetch(`https://api.covid19api.com/${path}`);
    const data = await res.json();

    return data;
  });

  return (
    <CovidDataContext.Provider value={covidQueryResult}>
      {children}
    </CovidDataContext.Provider>
  );
};
