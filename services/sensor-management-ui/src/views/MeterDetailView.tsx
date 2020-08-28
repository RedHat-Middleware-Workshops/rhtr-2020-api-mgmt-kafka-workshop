import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface RouteMatchParams extends RouteComponentProps<{ meterId: string }> {}

const MeterDetailView: React.FC<RouteMatchParams> = (props) => {
  return (
    <p>Detail view for Meter with UUID: {JSON.stringify(props.match.params.meterId)}</p>
  );
}

export default withRouter(MeterDetailView);
