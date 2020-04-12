import React, { useCallback } from "react";
import { useQuery } from "react-query";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSpinner,
} from "@ionic/react";
import { Country } from "../models/Country";

interface StatsCardProps {
  countrySlug: string;
  type: "confirmed" | "recovered" | "deaths";
}

const StatsCard: React.FC<StatsCardProps> = ({ countrySlug, type }) => {
  const { data, status } = useQuery(
    () => ["summary", countrySlug],
    async (path) => {
      const res = await fetch(`https://api.covid19api.com/${path}`);
      const data = await res.json();

      return data.Countries.find(
        (country: Country) => country.Slug === countrySlug
      );
    }
  );

  const getCardSubtitle = useCallback(() => {
    switch (type) {
      case "confirmed":
        return "Confirmed";
      case "recovered":
        return "Recovered";
      case "deaths":
        return "Deceased";
      default:
        return undefined;
    }
  }, [type]);

  const getCardTitle = useCallback(
    (countryData: Country) => {
      switch (type) {
        case "confirmed":
          return countryData.TotalConfirmed;
        case "recovered":
          return countryData.TotalRecovered;
        case "deaths":
          return countryData.TotalDeaths;
        default:
          return undefined;
      }
    },
    [type]
  );

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>{getCardSubtitle()}</IonCardSubtitle>
        <IonCardTitle>
          {status === "loading" ? (
            <IonSpinner name="dots" />
          ) : data ? (
            getCardTitle(data)
          ) : (
            "Error"
          )}
        </IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default StatsCard;
