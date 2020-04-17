import React, { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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
  IonFooter,
  IonNote,
} from "@ionic/react";
import { SocialSharing } from "@ionic-native/social-sharing";
import { RouteComponentProps } from "react-router";
import { shareOutline } from "ionicons/icons";
import StatsCard from "../components/StatsCard";
import { Country } from "../models/Country";

// Contexts
import { useCovidData } from "../contexts/CovidData.context";

// Add relative time plugin to DayJS
dayjs.extend(relativeTime);

interface CountryDetailsProps extends RouteComponentProps<{ slug: string }> {}

const CountryDetails: React.FC<CountryDetailsProps> = ({ match }) => {
  const [toastMessage, setToastMessage] = useState<string | undefined>();

  const { data, status } = useCovidData();

  const countryData = useMemo(() => {
    return data.Countries.find(
      (country: Country) => country.Slug === match.params.slug
    );
  }, [data.Countries, match.params.slug]);

  const getFooterLabel = useCallback(() => {
    if (countryData?.Date) {
      const lastUpdate = dayjs(countryData?.Date);

      return `Updated ${dayjs().to(lastUpdate)}`;
    }

    return "Updating...";
  }, [countryData]);

  const onToastDismiss = useCallback(() => {
    setToastMessage(undefined);
  }, []);

  const openShareSheet = useCallback(async () => {
    const lastUpdate = countryData?.Date
      ? dayjs(countryData.Date).format("MMMM D, YYYY [at] h:mm A")
      : "unknown";

    const messageToShare = {
      title: `COVID-19 Stats for ${countryData?.Country}`,
      text: `COVID-19 Stats for ${countryData?.Country}\n\nConfirmed: ${countryData?.TotalConfirmed}\nRecovered: ${countryData?.TotalRecovered}\nDeaths: ${countryData?.TotalDeaths}\n\nLast update: ${lastUpdate}`,
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
  }, [countryData]);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/countries"></IonBackButton>
          </IonButtons>
          <IonTitle>{countryData?.Country}</IonTitle>
          {countryData && (
            <IonButtons slot="end">
              <IonButton slot="icon-only" onClick={openShareSheet}>
                <IonIcon icon={shareOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <StatsCard
          count={countryData?.TotalConfirmed}
          loading={status === "loading"}
          type="confirmed"
        />
        <StatsCard
          count={countryData?.TotalRecovered}
          loading={status === "loading"}
          type="recovered"
        />
        <StatsCard
          count={countryData?.TotalDeaths}
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

      <IonFooter translucent className="ion-text-center">
        <IonToolbar>
          <IonNote>{getFooterLabel()}</IonNote>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default CountryDetails;
