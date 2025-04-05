import "../styles/wizard.css";

const Wizard = ({ loading }) => (
    <>
      <img src="/wizard-friend.png" alt="Crop Wizard" className="wizard" />
      <div className="speech-bubble">
        {loading
          ? "⚡ Hokus Pokus, ich schneid den Kram zusammen..."
          : "Ich bin der Crop-Wizard. Gib mir was zum Schnippeln!"}
      </div>
    </>
  );
  
  export default Wizard;
  