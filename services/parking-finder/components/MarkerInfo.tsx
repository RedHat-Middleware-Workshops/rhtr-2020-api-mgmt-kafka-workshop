
type MarkerInfoProps = {
  address: string
  lat: number
  lng: number
}

export const MarkerInfo: React.FC<MarkerInfoProps> = (props) => {
  return (
    <div style={{
      textAlign: 'center',
      margin: '0.5em'
      }}>
      <p>{props.address}</p>
      <a href={`https://maps.google.com/maps/?q=${props.lat},${props.lng}`}>Get Directions</a>
    </div>
  )
}
