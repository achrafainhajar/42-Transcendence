import React, { useState, useRef, useEffect } from "react";
import apiClient from "../../services/api-client";
import QRCode from "react-qr-code";
import { IoMdCloseCircle } from "react-icons/io";

interface Props {
  canClose: boolean;
  onClose: () => void;
  postSubmit: (input: { otp: string; secret?: string }) => void;
  generateSecret: boolean;
}
const OTPInputComponent: React.FC<Props> = ({
  onClose,
  postSubmit,
  generateSecret = false,
  canClose = false,
}) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [TFAPATH, setTFAPATH] = useState("");
  const [secret, setsecret] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (generateSecret)
      apiClient.get(`/auth/generate2fa`).then((res) => {
        setTFAPATH(res.data.otpauth);
        setsecret(res.data.secret);
      });
  }, [generateSecret]);
  const focusNextInput = (index: number) => {
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrevInput = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").trim();

    // Take only the first 6 characters, and ensure they are digits
    const trimmedData = pastedData.substring(0, 6).replace(/[^0-9]/g, "");

    // Split the data into individual characters
    const newOtp = trimmedData.split("");

    // Fill the rest of the OTP array with empty strings if necessary
    while (newOtp.length < 6) {
      newOtp.push("");
    }

    setOtp(newOtp);
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    // Check if the input value is a digit
    if (element.value === "" || /^[0-9]$/.test(element.value)) {
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      if (element.value.length === 1 && index < 5) {
        focusNextInput(index);
      }
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && otp[index] === "") {
      focusPrevInput(index);
    }
  };

  const handleSubmit = async () => {
    try {
      const otpValue = otp.join("");
      await postSubmit({ otp: otpValue, secret: secret });
      setError(null); // Clear error on successful submission
      onClose();
    } catch (error) {
      // Handle error appropriately
      setError("Failed to verify 2FA. Please try again.");
      setOtp(Array(6).fill(""));
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center px-20">
      <div className="container mx-auto">
        <div className="max-w-sm mx-auto md:max-w-lg">
          <div className="w-full">
            <div className="relative bg-white min-h-64 py-3 rounded text-center">
              {canClose && (
                <button
                  className="w-auto place-self-end absolute right-1 top-1 text-blue-900 hover:text-blue-500"
                  onClick={onClose}
                >
                  <IoMdCloseCircle />
                </button>
              )}
              <h1 className="text-2xl font-bold">2FA Verification</h1>
              {generateSecret && (
                <div className="flex flex-col mt-4 ">
                  <QRCode value={TFAPATH}
				fgColor="#072083"
				  className="w-24 h-24 mx-auto" />
                </div>
              )}
              <div className="flex flex-col mt-4">
                <span>
                  Enter 6-digit code from your authenticator application
                </span>
              </div>

              <div className="flex flex-row justify-center text-center px-2 mt-5">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    className="m-2 border h-10 w-10 text-center form-control rounded"
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              {error && <div className="text-red-500">{error}</div>}

              <div className="flex justify-center text-center mt-5">
                <button
                  className="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer"
                  onClick={handleSubmit}
                >
                  <span className="font-bold">Submit 2FA</span>
                  <i className="bx bx-caret-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPInputComponent;
