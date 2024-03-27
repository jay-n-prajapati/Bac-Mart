import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import Input from "../../common/Input";
import ButtonComponent from "../../common/ButtonComponent";
import { useSelector } from "react-redux";

const Contact = () => {
  const user = useSelector((state) => state.role.user);
  const seller = useSelector((state) => state.role.seller);

  const [formData, setFormData] = useState({
    name: user?.name || seller?.name || "",
    email: user?.email || seller?.email || "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { name, email, phone, message } = formData;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function translateMessage(text) {
    if (text === undefined || text === null || text.trim().length === 0)
      return "";

    const translateAPI = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURI(
      text
    )}`;

    try {
      const response = await axios.get(translateAPI, { timeout: 5000 });
      if (response.status == 200) {
        return response.data[0][0][0];
      }
    } catch (err) {
      return "-";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const translatedMessage = await translateMessage(message);
      const response = await axios.post(
        import.meta.env.VITE_CONTACT_FORM_DATA_API,
        {
          name: name,
          email: email,
          "phone no": phone,
          message: message,
          "translated message": translatedMessage,
          "date/time": new Date().toLocaleString("en-in"),
        },
        {
          timeout: 5000,
        }
      );
      if (response.status == 201) {
        toast.success("Message Sent Successfully");
      } else {
        throw new Error("Something Went Wrong");
      }
      setIsLoading(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setIsLoading(false);
      toast.error("Something Went Wrong");
    }
  };

  const inputGroupClass = "flex flex-col mt-2";
  const inputLabelClass =
    "text flex items-center gap-2 mb-0.5 text-black font-bold";
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex justify-center items-center py-10">
        <div className="flex flex-col bg-white py-8 px-5 md:px-[5rem] rounded-md">
          <div className="text-center text-3xl font-bold">
            <h1>Contact Us</h1>
          </div>
          <div className="flex justify-center items-center">
            <div className="contact-form mt-3 py-8 px-5 md:px-[5rem] rounded-md bg-white">
              <form onSubmit={handleSubmit}>
                <div className={inputGroupClass}>
                  <label htmlFor="name" className={inputLabelClass}>
                    <FaUser /> Name
                  </label>
                  <Input
                    className="border-gray-200"
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                  />
                </div>
                <div className={inputGroupClass}>
                  <label htmlFor="email" className={inputLabelClass}>
                    <IoIosMail /> Email
                  </label>
                  <Input
                    className="border-gray-200"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                  />
                </div>
                <div className={inputGroupClass}>
                  <label htmlFor="phone" className={inputLabelClass}>
                    <FaPhoneAlt /> Contact No<small>(optional)</small>
                  </label>
                  <Input
                    className="border-gray-200"
                    type="number"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>
                <div className={inputGroupClass}>
                  <label htmlFor="message" className={inputLabelClass}>
                    <MdMessage /> Message
                  </label>
                  <textarea
                    className="px-2 py-1 border-2 rounded-md focus:outline-none border-gray-400 w-[min(24rem,85vw)] focus:border-black"
                    name="message"
                    id="message"
                    cols="30"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="form-btn">
                  <ButtonComponent type="submit" handleClick={() => {}}>
                    SEND MESSAGE
                  </ButtonComponent>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Contact;
