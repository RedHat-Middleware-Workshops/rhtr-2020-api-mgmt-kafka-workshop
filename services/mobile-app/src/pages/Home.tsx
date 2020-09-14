import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <img src="assets/images/los-angeles-freeways.jpg" alt="Los Angeles Freeways"/>
        <div className="ion-padding">
          <h2>Hi there!</h2>
          <p>This application provides real-time Traffic and Meter data insights. Navigate to the Meters or Junctions tab to see for yourself.</p>
          <p>How does all of this work? Well, the real-time data streams are powered by a Quarkus application that exposes them via HTTP <a href="https://en.wikipedia.org/wiki/Server-sent_events" target="_blank">Server-sent Events</a>.</p>
          <p>All of the Junctions and Meters listed are based on real data from the City of Los Angeles, but the events are simulated. Pretty neat, right!?</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
