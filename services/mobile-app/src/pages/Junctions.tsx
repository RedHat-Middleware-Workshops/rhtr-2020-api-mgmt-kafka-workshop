import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Junctions.css';

const Junctions: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Junctions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Junctions</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Junctions page" />
      </IonContent>
    </IonPage>
  );
};

export default Junctions;
