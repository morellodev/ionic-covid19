import React from "react";
import { IonItem, IonLabel, IonNote, IonAvatar } from "@ionic/react";
import { Country } from "../models/Country";

interface CountryListItemProps {
  country: Country;
}

const CountryListItem: React.FC<CountryListItemProps> = ({ country }) => {
  return (
    <IonItem routerLink={`/country/${country.Slug}`}>
      <IonAvatar slot="start">
        <img
          alt={country.CountryCode}
          src={`/assets/images/flags/${country.CountryCode}.svg`}
        />
      </IonAvatar>
      <IonLabel>{country.Country}</IonLabel>
      <IonNote slot="end">{country.TotalConfirmed}</IonNote>
    </IonItem>
  );
};

export default CountryListItem;
