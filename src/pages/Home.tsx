import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonLoading,
} from "@ionic/react";
import { Country } from "../models/Country";
import CountryListItem from "../components/CountryListItem";

const Home: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");

  const { data, refetch, status } = useQuery("summary", async (path) => {
    const res = await fetch(`https://api.covid19api.com/${path}`);
    const data = await res.json();

    return data;
  });

  async function onPullToRefresh(e: CustomEvent) {
    await refetch();
    e.detail.complete();
  }

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Countries</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={onPullToRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Countries</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              value={searchText}
              onIonChange={(e) => setSearchText(e.detail.value!)}
              showCancelButton="focus"
            />
          </IonToolbar>
        </IonHeader>

        <IonLoading isOpen={status === "loading"} message="Loading data..." />

        {data?.Countries?.length && (
          <IonList>
            {data.Countries.filter((country: Country) => {
              const lowerCaseCountry = country.Country.toLowerCase();
              const query = searchText.toLowerCase();

              return (
                country.TotalConfirmed > 0 && lowerCaseCountry.match(query)
              );
            })
              .sort(
                (countryA: Country, countryB: Country) =>
                  countryB.TotalConfirmed - countryA.TotalConfirmed
              )
              .map((country: Country) => (
                <CountryListItem key={country.CountryCode} country={country} />
              ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
