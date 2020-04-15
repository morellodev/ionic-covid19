import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  isPlatform,
  IonToast,
} from "@ionic/react";
import { SocialSharing } from "@ionic-native/social-sharing";
import { RouteComponentProps } from "react-router";
import { shareOutline } from "ionicons/icons";
import StatsCard from "../components/StatsCard";
import { Country } from "../models/Country";

interface CountryDetailsProps extends RouteComponentProps<{ slug: string }> {}

const CountryDetails: React.FC<CountryDetailsProps> = ({ match }) => {
  const [toastMessage, setToastMessage] = useState<string | undefined>();

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

  const onToastDismiss = useCallback(() => {
    setToastMessage(undefined);
  }, []);

  const openShareSheet = useCallback(async () => {
    const lastUpdate = data?.Date
      ? new Date(data.Date).toUTCString()
      : "unknown";

    const messageToShare = {
      title: `COVID-19 Stats for ${data?.Country}`,
      text: `COVID-19 Stats for ${data?.Country}\n\nConfirmed: ${data?.TotalConfirmed}\nRecovered: ${data?.TotalRecovered}\nDeaths: ${data?.TotalDeaths}\n\nLast update: ${lastUpdate}`,
    };

    try {
      if (isPlatform("mobile")) {
        await SocialSharing.shareWithOptions({
          message: messageToShare.text,
          subject: messageToShare.title,
        });
      } else if (isPlatform("mobileweb")) {
        await (navigator as any).share(messageToShare);
      } else {
        throw new Error("Unsupported platform");
      }
    } catch (error) {
      setToastMessage("Sharing is not available");
    }
  }, [data]);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>{data?.Country}</IonTitle>
          {data && (
            <IonButtons slot="end">
              <IonButton onClick={openShareSheet}>
                <IonIcon icon={shareOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <StatsCard
          count={data?.TotalConfirmed}
          loading={status === "loading"}
          type="confirmed"
        />
        <StatsCard
          count={data?.TotalRecovered}
          loading={status === "loading"}
          type="recovered"
        />
        <StatsCard
          count={data?.TotalDeaths}
          loading={status === "loading"}
          type="deaths"
        />

        <IonToast
          isOpen={toastMessage !== undefined}
          message={toastMessage}
          onDidDismiss={onToastDismiss}
          duration={5000}
          buttons={[
            {
              text: "Dismiss",
              role: "cancel",
              handler: onToastDismiss,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default CountryDetails;
