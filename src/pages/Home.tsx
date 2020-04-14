import React, { useCallback, useState } from "react";
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
  isPlatform,
  IonButton,
  IonIcon,
  IonButtons,
} from "@ionic/react";
import { search } from "ionicons/icons";
import { Country } from "../models/Country";
import CountryListItem from "../components/CountryListItem";

const Home: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [showSearchbar, setShowSearchbar] = useState(false);

  const { data, refetch, status } = useQuery("summary", async (path) => {
    const res = await fetch(`https://api.covid19api.com/${path}`);
    const data = await res.json();

    return data;
  });

  const onPullToRefresh = useCallback(
    async (event: CustomEvent) => {
      await refetch();
      event.detail.complete();
    },
    [refetch]
  );

  const onSearchTextChanged = useCallback((event: CustomEvent) => {
    setSearchText(event.detail.value!);
  }, []);

  const toggleSearchbar = useCallback(() => {
    setShowSearchbar((wasSearchbarShown) => !wasSearchbarShown);
  }, []);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          {showSearchbar ? (
            <IonSearchbar
              value={searchText}
              onIonChange={onSearchTextChanged}
              onIonCancel={toggleSearchbar}
              showCancelButton="always"
            />
          ) : (
            <>
              <IonTitle>Countries</IonTitle>
              {!isPlatform("ios") && (
                <IonButtons slot="end">
                  <IonButton onClick={toggleSearchbar}>
                    <IonIcon icon={search} />
                  </IonButton>
                </IonButtons>
              )}
            </>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={onPullToRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {isPlatform("ios") && (
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Countries</IonTitle>
            </IonToolbar>
            <IonToolbar>
              <IonSearchbar
                value={searchText}
                onIonChange={onSearchTextChanged}
                showCancelButton="focus"
              />
            </IonToolbar>
          </IonHeader>
        )}

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
