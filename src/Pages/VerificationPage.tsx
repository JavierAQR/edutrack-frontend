import { useSearchParams } from "react-router";
import "./VerificationPage.css";

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  let message = "";
  let messageType = "info";

  switch (status) {
    case "success":
      message =
        "¡Tu correo ha sido verificado exitosamente! ahora puedes iniciar sesión";
      messageType = "success";
      break;
    case "invalid-token":
      message = "El token de verificacion es invalido";
      messageType = "error";
      break;
    case "expired":
      message =
        "El token de verificacion ha expirado. Por favor, solicita uno nuevo";
      messageType = "error";
      break;
    case "error":
      message =
        "Ocurrio un error durante la verificacion. Por favor, solicita uno nuevo";
      messageType = "error";
      break;
    default:
      message = "verificando...";
      messageType = "info";
  }
  
  return (
    <div className={`verification-container ${messageType}`}>
      <h1>Verificación de Email</h1>
      <p>{message}</p>
      {messageType === "success" && (
        <button onClick={() => (window.location.href = "/login")}>
          Ir a iniciar sesión
        </button>
      )}
      {messageType === "error" && (
        <button onClick={() => (window.location.href = "/login")}>
          Ir a iniciar sesión
        </button>
      )}
    </div>
  );
};

export default VerificationPage;
