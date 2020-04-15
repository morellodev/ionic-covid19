import React from "react";
import { IonItem, IonLabel, IonAvatar, IonBadge } from "@ionic/react";
import { Country } from "../models/Country";
import NumberCount from "./NumberCount";

interface CountryListItemProps {
  country: Country;
}

const CountryListItem: React.FC<CountryListItemProps> = ({ country }) => {
  return (
    <IonItem routerLink={`/countries/${country.Slug}`}>
      <IonAvatar slot="start">
        <img
          alt={country.CountryCode}
          src={`/assets/images/flags/${country.CountryCode}.svg`}
        />
      </IonAvatar>
      <IonLabel>{country.Country}</IonLabel>
      <IonBadge slot="end" color="medium">
        <NumberCount>{country.TotalConfirmed}</NumberCount>
      </IonBadge>
    </IonItem>
  );
};

export default CountryListItem;
