import React from "react";
import { useQuery } from "react-query";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import StatsCard from "../components/StatsCard";
import { Country } from "../models/Country";

interface CountryDetailsProps extends RouteComponentProps<{ slug: string }> {}

const CountryDetails: React.FC<CountryDetailsProps> = ({ match }) => {
  const { data, status } = useQuery(
    () => !!match.params.slug && ["summary", match.params.slug],
    async (path, countrySlug) => {
      const res = await fetch(`https://api.covid19api.com/${path}`);
      const data = await res.json();

      return data.Countries.find(
        (country: Country) => country.Slug === countrySlug
      );
    }
  );

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons>
            <IonBackButton text="Countries" defaultHref="/home"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <StatsCard
          count={data?.TotalConfirmed}
          loading={status === "loading"}
          type="confirmed"
        />{" "}
        <StatsCard
          count={data?.TotalRecovered}
          loading={status === "loading"}
          type="recovered"
        />{" "}
        <StatsCard
          count={data?.TotalDeaths}
          loading={status === "loading"}
          type="deaths"
        />
      </IonContent>
    </IonPage>
  );
};

export default CountryDetails;
