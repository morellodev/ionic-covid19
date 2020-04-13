import React, { useCallback } from "react";
import {
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonSpinner,
  IonCardContent,
} from "@ionic/react";

interface StatsCardProps {
  count: number;
  loading: boolean;
  type: "confirmed" | "recovered" | "deaths";
}

const numberFormatter = new Intl.NumberFormat();

const StatsCard: React.FC<StatsCardProps> = ({ count, loading, type }) => {
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

  return (
    <IonCard>
      <IonCardContent>
        <IonCardSubtitle>{getCardSubtitle()}</IonCardSubtitle>
        <IonCardTitle>
          {loading ? <IonSpinner name="dots" /> : numberFormatter.format(count)}
        </IonCardTitle>
      </IonCardContent>
    </IonCard>
  );
};

export default StatsCard;
