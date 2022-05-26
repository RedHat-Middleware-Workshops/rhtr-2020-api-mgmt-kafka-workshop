
import './Spinner.css'

const Spinner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="w-full my-10 text-center">
      <h2 className="text-2xl pb-5">{message}</h2>
      <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Spinner
