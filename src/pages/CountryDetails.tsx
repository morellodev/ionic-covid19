import React from "react";
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

interface CountryDetailsProps extends RouteComponentProps<{ slug: string }> {}

const CountryDetails: React.FC<CountryDetailsProps> = ({ match }) => {
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
        <StatsCard countrySlug={match.params.slug} type="confirmed" />
        <StatsCard countrySlug={match.params.slug} type="recovered" />
        <StatsCard countrySlug={match.params.slug} type="deaths" />
      </IonContent>
    </IonPage>
  );
};

export default CountryDetails;
